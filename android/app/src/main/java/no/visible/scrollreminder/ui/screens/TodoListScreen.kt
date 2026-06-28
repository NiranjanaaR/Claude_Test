package no.visible.scrollreminder.ui.screens

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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import no.visible.scrollreminder.data.TodoItem
import no.visible.scrollreminder.ui.MainViewModel
import no.visible.scrollreminder.ui.theme.BrandOrange

@Composable
fun TodoListScreen(viewModel: MainViewModel) {
    val todos by viewModel.todos.collectAsStateWithLifecycle()
    var newText by remember { mutableStateOf("") }
    var editing by remember { mutableStateOf<TodoItem?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp, vertical = 16.dp),
    ) {
        Text(
            text = "Things to do when I have time",
            style = MaterialTheme.typography.titleLarge,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(4.dp))
        Text(
            text = "These show up when a reminder fires.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )

        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(
                value = newText,
                onValueChange = { newText = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Add something…") },
                singleLine = true,
            )
            Spacer(Modifier.width(8.dp))
            IconButton(
                onClick = {
                    viewModel.addTodo(newText)
                    newText = ""
                },
            ) {
                Icon(
                    Icons.Filled.Add,
                    contentDescription = "Add",
                    tint = BrandOrange,
                )
            }
        }

        Spacer(Modifier.height(12.dp))
        if (todos.isEmpty()) {
            Text(
                text = "Nothing here yet. Add a few small things you'd rather be doing — " +
                    "call a friend, stretch, read a chapter.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 24.dp),
            )
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(todos, key = { it.id }) { item ->
                    TodoRow(
                        item = item,
                        onToggle = { viewModel.setTodoDone(item, !item.done) },
                        onEdit = { editing = item },
                        onDelete = { viewModel.deleteTodo(item) },
                    )
                }
            }
        }
    }

    editing?.let { item ->
        EditDialog(
            initial = item.text,
            onDismiss = { editing = null },
            onConfirm = { text ->
                viewModel.renameTodo(item, text)
                editing = null
            },
        )
    }
}

@Composable
private fun TodoRow(
    item: TodoItem,
    onToggle: () -> Unit,
    onEdit: () -> Unit,
    onDelete: () -> Unit,
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(14.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 8.dp, end = 4.dp, top = 4.dp, bottom = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Checkbox(checked = item.done, onCheckedChange = { onToggle() })
            Text(
                text = item.text,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface,
                textDecoration = if (item.done) TextDecoration.LineThrough else null,
                modifier = Modifier
                    .weight(1f)
                    .padding(vertical = 12.dp),
            )
            TextButton(onClick = onEdit) { Text("Edit") }
            IconButton(onClick = onDelete) {
                Icon(
                    Icons.Filled.Delete,
                    contentDescription = "Delete",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

@Composable
private fun EditDialog(
    initial: String,
    onDismiss: () -> Unit,
    onConfirm: (String) -> Unit,
) {
    var text by remember { mutableStateOf(initial) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Edit item") },
        text = {
            OutlinedTextField(
                value = text,
                onValueChange = { text = it },
                singleLine = true,
            )
        },
        confirmButton = { TextButton(onClick = { onConfirm(text) }) { Text("Save") } },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}
