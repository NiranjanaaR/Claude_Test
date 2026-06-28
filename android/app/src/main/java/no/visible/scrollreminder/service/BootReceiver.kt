package no.visible.scrollreminder.service

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import no.visible.scrollreminder.data.SettingsRepository
import no.visible.scrollreminder.util.Permissions

/** Restarts the watcher after reboot, but only if it was enabled and still has its permissions. */
class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) return

        val pending = goAsync()
        val appContext = context.applicationContext
        CoroutineScope(Dispatchers.Default).launch {
            try {
                val settings = SettingsRepository.from(appContext).settings.first()
                val ready = settings.enabled &&
                    settings.watchedPackages.isNotEmpty() &&
                    Permissions.hasUsageAccess(appContext)
                if (ready) UsageMonitorService.start(appContext)
            } finally {
                pending.finish()
            }
        }
    }
}
