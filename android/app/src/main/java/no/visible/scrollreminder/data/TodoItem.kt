package no.visible.scrollreminder.data

import androidx.room.Entity
import androidx.room.PrimaryKey

/** A "thing to do when I have time" item, shown on the interruption overlay. */
@Entity(tableName = "todo_items")
data class TodoItem(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val text: String,
    val done: Boolean = false,
    // Keeps the list in the order the user added items.
    val position: Long = 0,
)
