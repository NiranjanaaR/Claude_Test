package no.visible.scrollreminder.overlay

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.outlined.Circle
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import no.visible.scrollreminder.data.TodoItem
import no.visible.scrollreminder.ui.theme.BrandOrange

/**
 * The interruption itself: a calm, encouraging full-screen card listing the user's
 * "things to do when I have time". Black canvas, orange accents, large type.
 */
@Composable
fun OverlayScreen(
    appLabel: String,
    minutes: Int,
    loadTodos: suspend () -> List<TodoItem>,
    onToggleDone: (TodoItem) -> Unit,
    onDoSomething: () -> Unit,
    onSnooze: () -> Unit,
) {
    // Scrim so the scroll app shows faintly behind, keeping context without distraction.
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xF2111111), // ~95% opaque brand black
    ) {
        val todos by produceState(initialValue = emptyList<TodoItem>()) {
            value = loadTodos()
        }
        // Local optimistic state for checkmarks so taps feel instant.
        val checked = remember { mutableStateOf(setOf<Int>()) }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp, vertical = 32.dp),
        ) {
            Text(
                text = "You've been here a while",
                style = MaterialTheme.typography.displaySmall,
                color = MaterialTheme.colorScheme.onBackground,
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = subtitle(appLabel, minutes),
                style = MaterialTheme.typography.bodyLarge,
                color = BrandOrange,
            )

            Spacer(Modifier.height(24.dp))
            Text(
                text = "Maybe instead…",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.height(12.dp))

            if (todos.isEmpty()) {
                Text(
                    text = "Your list is empty. Open ScrollReminder to add a few things " +
                        "you'd rather be doing.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    items(todos, key = { it.id }) { item ->
                        val isDone = item.done || checked.value.contains(item.id)
                        TodoRow(
                            item = item,
                            isDone = isDone,
                            onClick = {
                                checked.value =
                                    if (isDone) checked.value - item.id
                                    else checked.value + item.id
                                onToggleDone(item)
                            },
                        )
                    }
                }
            }

            Spacer(Modifier.height(20.dp))

            Button(
                onClick = onDoSomething,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = BrandOrange,
                    contentColor = Color(0xFF111111),
                ),
            ) {
                Text("I'll do one of these", fontWeight = FontWeight.Bold)
            }

            Spacer(Modifier.height(10.dp))

            OutlinedButton(
                onClick = onSnooze,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
            ) {
                Text("5 more minutes")
            }
        }
    }
}

@Composable
private fun TodoRow(item: TodoItem, isDone: Boolean, onClick: () -> Unit) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(14.dp),
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                imageVector = if (isDone) Icons.Filled.CheckCircle else Icons.Outlined.Circle,
                contentDescription = null,
                tint = if (isDone) BrandOrange else MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.width(14.dp))
            Text(
                text = item.text,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface,
                textDecoration = if (isDone) TextDecoration.LineThrough else null,
                modifier = Modifier.alpha(if (isDone) 0.5f else 1f),
            )
        }
    }
}

private fun subtitle(appLabel: String, minutes: Int): String {
    val where = if (appLabel.isBlank()) "this app" else appLabel
    return "$minutes min in $where"
}
