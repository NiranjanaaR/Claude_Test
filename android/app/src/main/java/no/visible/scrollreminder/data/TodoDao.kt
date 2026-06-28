package no.visible.scrollreminder.data

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface TodoDao {

    @Query("SELECT * FROM todo_items ORDER BY position ASC, id ASC")
    fun observeAll(): Flow<List<TodoItem>>

    /** Snapshot read for the overlay, which is created outside a composition. */
    @Query("SELECT * FROM todo_items ORDER BY position ASC, id ASC")
    suspend fun getAll(): List<TodoItem>

    @Query("SELECT COALESCE(MAX(position), 0) FROM todo_items")
    suspend fun maxPosition(): Long

    @Insert
    suspend fun insert(item: TodoItem): Long

    @Update
    suspend fun update(item: TodoItem)

    @Delete
    suspend fun delete(item: TodoItem)

    @Query("UPDATE todo_items SET done = :done WHERE id = :id")
    suspend fun setDone(id: Int, done: Boolean)
}
