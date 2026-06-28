package no.visible.scrollreminder.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.lifecycle.LifecycleService
import androidx.lifecycle.lifecycleScope
import no.visible.scrollreminder.MainActivity
import no.visible.scrollreminder.R
import no.visible.scrollreminder.data.AppSettings
import no.visible.scrollreminder.data.SettingsRepository
import no.visible.scrollreminder.overlay.OverlayActivity
import no.visible.scrollreminder.util.InstalledApps
import no.visible.scrollreminder.util.Permissions
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

/**
 * Foreground service that polls the foreground app every few seconds and fires the
 * interruption overlay when a watched app crosses the threshold in one sitting.
 */
class UsageMonitorService : LifecycleService() {

    private val detector by lazy { ForegroundAppDetector(this) }
    private val tracker = SessionTracker()

    // Latest settings snapshot, kept fresh by collecting the DataStore flow.
    @Volatile
    private var settings: AppSettings = AppSettings()

    override fun onBind(intent: Intent): IBinder? {
        super.onBind(intent)
        return null
    }

    override fun onCreate() {
        super.onCreate()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                NOTIFICATION_ID,
                buildNotification(),
                ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE,
            )
        } else {
            startForeground(NOTIFICATION_ID, buildNotification())
        }

        // Keep settings current.
        lifecycleScope.launch {
            SettingsRepository.from(this@UsageMonitorService).settings.collectLatest {
                settings = it
                if (!it.enabled) tracker.reset()
            }
        }

        // Poll loop.
        lifecycleScope.launch {
            while (isActive) {
                runCatching { pollOnce() }
                delay(POLL_INTERVAL_MS)
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        super.onStartCommand(intent, flags, startId)
        // Restart if killed; the service is the whole point of the app.
        return START_STICKY
    }

    private fun pollOnce() {
        val current = settings
        if (!current.enabled || current.watchedPackages.isEmpty()) {
            tracker.reset()
            return
        }
        // Without usage access we can't read the foreground app; nothing to do.
        if (!Permissions.hasUsageAccess(this)) return

        val now = System.currentTimeMillis()
        val pkg = detector.currentForegroundPackage(now, windowMs = POLL_INTERVAL_MS + 5_000L)
        val result = tracker.tick(pkg, now, current)

        if (result.shouldFire && result.firedPackage != null) {
            // Need overlay permission to actually show on top.
            if (!Permissions.hasOverlay(this)) return
            fireOverlay(result.firedPackage, result.elapsedMs)
        }
    }

    private fun fireOverlay(pkg: String, elapsedMs: Long) {
        val label = InstalledApps.labelFor(this, pkg)
        val minutes = (elapsedMs / 60_000L).toInt().coerceAtLeast(1)
        startActivity(
            OverlayActivity.intent(this, appLabel = label, minutes = minutes)
        )
    }

    private fun buildNotification(): Notification {
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                getString(R.string.notification_channel_name),
                NotificationManager.IMPORTANCE_LOW,
            ).apply {
                description = getString(R.string.notification_text)
                setShowBadge(false)
            }
            nm.createNotificationChannel(channel)
        }

        val openApp = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )

        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
        } else {
            @Suppress("DEPRECATION")
            Notification.Builder(this)
        }

        return builder
            .setContentTitle(getString(R.string.app_name))
            .setContentText(getString(R.string.notification_text))
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setOngoing(true)
            .setContentIntent(openApp)
            .build()
    }

    companion object {
        private const val CHANNEL_ID = "scrollreminder_watching"
        private const val NOTIFICATION_ID = 1001
        private const val POLL_INTERVAL_MS = 5_000L

        fun start(context: Context) {
            val intent = Intent(context, UsageMonitorService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, UsageMonitorService::class.java))
        }
    }
}
