package no.visible.scrollreminder.service

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context

/**
 * Reads the most-recent foreground package via UsageStatsManager events.
 *
 * queryUsageStats totals are too coarse for live session tracking, so we walk
 * MOVE_TO_FOREGROUND events over a short recent window and take the latest one.
 */
class ForegroundAppDetector(context: Context) {

    private val usm =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    /**
     * @param windowMs how far back to look. Slightly longer than the poll interval so
     *   we never miss an event that landed between polls.
     * @return the package most recently moved to the foreground, or null if none in window.
     */
    fun currentForegroundPackage(now: Long, windowMs: Long = 10_000L): String? {
        val events = usm.queryEvents(now - windowMs, now)
        val event = UsageEvents.Event()
        var lastForegroundPkg: String? = null
        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            if (event.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND ||
                event.eventType == UsageEvents.Event.ACTIVITY_RESUMED
            ) {
                lastForegroundPkg = event.packageName
            }
        }
        return lastForegroundPkg
    }
}
