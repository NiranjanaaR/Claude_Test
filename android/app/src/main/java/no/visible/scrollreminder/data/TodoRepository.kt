package no.visible.scrollreminder.data

import android.content.Context
import kotlinx.coroutines.flow.Flow

/** Thin wrapper around [TodoDao] so the rest of the app never touches Room directly. */
class TodoRepository(private val dao: TodoDao) {

    val items: Flow<List<TodoItem>> = dao.observeAll()

    suspend fun snapshot(): List<TodoItem> = dao.getAll()

    suspend fun add(text: String) {
        val trimmed = text.trim()
        if (trimmed.isEmpty()) return
        dao.insert(TodoItem(text = trimmed, position = dao.maxPosition() + 1))
    }

    suspend fun rename(item: TodoItem, text: String) {
        val trimmed = text.trim()
        if (trimmed.isEmpty()) return
        dao.update(item.copy(text = trimmed))
    }

    suspend fun setDone(id: Int, done: Boolean) = dao.setDone(id, done)

    suspend fun delete(item: TodoItem) = dao.delete(item)

    companion object {
        fun from(context: Context) = TodoRepository(AppDatabase.get(context).todoDao())
    }
}
