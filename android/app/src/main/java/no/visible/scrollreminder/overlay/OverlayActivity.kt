package no.visible.scrollreminder.overlay

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import no.visible.scrollreminder.data.TodoItem
import no.visible.scrollreminder.data.TodoRepository
import no.visible.scrollreminder.ui.theme.ScrollReminderTheme

/**
 * Translucent full-screen interruption shown on top of the watched app. It launches as its
 * own task so it appears over whatever the user was scrolling, then finishes itself when the
 * user picks an action.
 */
class OverlayActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val appLabel = intent.getStringExtra(EXTRA_APP_LABEL) ?: ""
        val minutes = intent.getIntExtra(EXTRA_MINUTES, 0)

        setContent {
            ScrollReminderTheme {
                OverlayScreen(
                    appLabel = appLabel,
                    minutes = minutes,
                    loadTodos = { TodoRepository.from(applicationContext).snapshot() },
                    onToggleDone = { item -> toggleDone(item) },
                    onDoSomething = { goHomeAndClose() },
                    onSnooze = { goHomeAndClose() },
                )
            }
        }
    }

    private fun toggleDone(item: TodoItem) {
        lifecycleScope.launch {
            TodoRepository.from(applicationContext).setDone(item.id, !item.done)
        }
    }

    /** Send the user to the launcher (away from the scroll app) and dismiss the overlay. */
    private fun goHomeAndClose() {
        val home = Intent(Intent.ACTION_MAIN)
            .addCategory(Intent.CATEGORY_HOME)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(home)
        finish()
    }

    override fun onPause() {
        super.onPause()
        // If the user navigates away by any means, don't linger.
        if (!isFinishing) finish()
    }

    companion object {
        private const val EXTRA_APP_LABEL = "extra_app_label"
        private const val EXTRA_MINUTES = "extra_minutes"

        fun intent(context: Context, appLabel: String, minutes: Int): Intent =
            Intent(context, OverlayActivity::class.java)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                .putExtra(EXTRA_APP_LABEL, appLabel)
                .putExtra(EXTRA_MINUTES, minutes)
    }
}
