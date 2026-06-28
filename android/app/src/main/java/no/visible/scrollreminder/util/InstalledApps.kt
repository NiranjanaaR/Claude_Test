package no.visible.scrollreminder.util

import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.drawable.Drawable

/** A user-facing installed app the user can choose to watch. */
data class InstalledApp(
    val packageName: String,
    val label: String,
    val icon: Drawable?,
)

object InstalledApps {

    /**
     * Returns launchable apps (the ones with a launcher icon), excluding ourselves,
     * sorted by display name. We deliberately skip system apps with no launcher so the
     * picker shows only things the user actually opens and scrolls in.
     */
    fun list(context: Context): List<InstalledApp> {
        val pm = context.packageManager
        val launcherIntent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
        val resolved = pm.queryIntentActivities(launcherIntent, 0)

        return resolved
            .asSequence()
            .map { it.activityInfo.applicationInfo }
            .distinctBy { it.packageName }
            .filter { it.packageName != context.packageName }
            .map { info: ApplicationInfo ->
                InstalledApp(
                    packageName = info.packageName,
                    label = pm.getApplicationLabel(info).toString(),
                    icon = runCatching { pm.getApplicationIcon(info) }.getOrNull(),
                )
            }
            .sortedBy { it.label.lowercase() }
            .toList()
    }

    /** Resolve a single package's display label, falling back to the package name. */
    fun labelFor(context: Context, packageName: String): String =
        runCatching {
            val pm = context.packageManager
            pm.getApplicationLabel(pm.getApplicationInfo(packageName, 0)).toString()
        }.getOrDefault(packageName)
}
