package no.visible.scrollreminder.service

import no.visible.scrollreminder.data.AppSettings

/**
 * Pure session-timer logic, decoupled from Android so it can be reasoned about and tested.
 *
 * It holds one "current sitting" in a watched app:
 *  - the timer counts up while that app is foreground,
 *  - a quick glance away (< breakReset) keeps the sitting alive,
 *  - a real break (>= breakReset away) resets it to zero,
 *  - crossing the threshold fires the overlay, then a per-app cooldown suppresses re-nagging.
 *
 * All times are millis from a monotonic-ish clock supplied by the caller (`now`).
 */
class SessionTracker {

    private var currentPkg: String? = null
    private var sessionStartTime: Long = 0L
    private var lastSeenTime: Long = 0L

    // Per-package timestamp of the last overlay fire, for the cooldown window.
    private val lastFiredAt = mutableMapOf<String, Long>()

    data class TickResult(
        val shouldFire: Boolean = false,
        val firedPackage: String? = null,
        val elapsedMs: Long = 0L,
    )

    /** Drop all session state (e.g. when monitoring is disabled). Cooldowns are kept. */
    fun reset() {
        currentPkg = null
        sessionStartTime = 0L
        lastSeenTime = 0L
    }

    /**
     * Advance the tracker by one poll.
     *
     * @param foregroundPkg package currently in the foreground (null if unknown).
     * @param now current time in millis.
     * @param settings live settings snapshot.
     */
    fun tick(foregroundPkg: String?, now: Long, settings: AppSettings): TickResult {
        val breakResetMs = settings.breakResetSeconds * 1000L
        val thresholdMs = settings.thresholdMinutes * 60_000L
        val cooldownMs = settings.cooldownMinutes * 60_000L

        val isWatched = foregroundPkg != null && foregroundPkg in settings.watchedPackages

        // Not in a watched app right now.
        if (!isWatched) {
            val active = currentPkg
            if (active != null && now - lastSeenTime >= breakResetMs) {
                // Long enough away — the sitting is over.
                reset()
            }
            return TickResult()
        }

        val pkg = foregroundPkg!!

        if (pkg != currentPkg) {
            // Switched into a different watched app (or starting fresh) — new sitting.
            currentPkg = pkg
            sessionStartTime = now
            lastSeenTime = now
            return TickResult(elapsedMs = 0L)
        }

        // Continuing the same sitting.
        lastSeenTime = now
        val elapsed = now - sessionStartTime

        if (elapsed < thresholdMs) {
            return TickResult(elapsedMs = elapsed)
        }

        // Threshold crossed — fire unless we're still inside this app's cooldown window.
        // (Guard the null case explicitly; subtracting a sentinel would overflow.)
        val lastFired = lastFiredAt[pkg]
        val inCooldown = lastFired != null && now - lastFired < cooldownMs
        if (inCooldown) {
            return TickResult(elapsedMs = elapsed)
        }

        lastFiredAt[pkg] = now
        return TickResult(shouldFire = true, firedPackage = pkg, elapsedMs = elapsed)
    }

    /** Force a cooldown for [pkg] starting now (used by the "5 more minutes" snooze). */
    fun startCooldown(pkg: String, now: Long) {
        lastFiredAt[pkg] = now
    }
}
