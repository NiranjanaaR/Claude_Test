package no.visible.scrollreminder.ui.screens

import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner

/**
 * Re-evaluates [check] every time the screen resumes, so a permission granted in system
 * Settings flips to "Granted ✓" the instant the user returns to the app.
 */
@Composable
fun rememberOnResume(check: () -> Boolean): State<Boolean> {
    val lifecycleOwner = LocalLifecycleOwner.current
    val state = remember { mutableStateOf(check()) }

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) {
                state.value = check()
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }
    return state
}
