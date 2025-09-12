# Building a Todo List App

In this tutorial, you'll create a fully-featured todo list application using Refract. This project will teach you advanced state management, form handling, data persistence, and component composition patterns.

## What You'll Build

- Add, edit, and delete todos
- Mark todos as complete/incomplete
- Filter todos by status (all, active, completed)
- Persist data to localStorage
- Drag and drop reordering
- Bulk operations (mark all, clear completed)
- Search and categorization

## Project Setup

```bash
npx create-refract-app todo-app
cd todo-app
npm start
```

## Step 1: Basic Todo Structure

### Create the Todo Model

```javascript
// src/models/Todo.js
export class Todo {
  constructor(text, category = 'general') {
    this.id = Date.now() + Math.random();
    this.text = text;
    this.completed = false;
    this.category = category;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  
  toggle() {
    this.completed = !this.completed;
    this.updatedAt = new Date();
    return this;
  }
  
  update(text) {
    this.text = text;
    this.updatedAt = new Date();
    return this;
  }
}
```

### Create Todo Item Component

```javascript
// src/components/TodoItem.js
import { createComponent } from 'refract';

const TodoItem = createComponent(({ lens, todo, onToggle, onDelete, onEdit }) => {
  const isEditing = lens.useRefraction(false);
  const editText = lens.useRefraction(todo.text);
  
  const handleEdit = () => {
    if (isEditing.value) {
      onEdit(todo.id, editText.value);
      isEditing.set(false);
    } else {
      editText.set(todo.text);
      isEditing.set(true);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      editText.set(todo.text);
      isEditing.set(false);
    }
  };
  
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
        />
        
        {isEditing.value ? (
          <input
            type="text"
            value={editText.value}
            onChange={(e) => editText.set(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleEdit}
            className="todo-edit-input"
            autoFocus
          />
        ) : (
          <span 
            className="todo-text"
            onDoubleClick={() => isEditing.set(true)}
          >
            {todo.text}
          </span>
        )}
        
        <span className="todo-category">{todo.category}</span>
      </div>
      
      <div className="todo-actions">
        <button
          onClick={handleEdit}
          className="btn btn-edit"
          title={isEditing.value ? 'Save' : 'Edit'}
        >
          {isEditing.value ? '✓' : '✏️'}
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="btn btn-delete"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
});

export default TodoItem;
```

## Step 2: Todo List Container

```javascript
// src/components/TodoList.js
import { createComponent } from 'refract';
import { Todo } from '../models/Todo';
import TodoItem from './TodoItem';

const TodoList = createComponent(({ lens }) => {
  // Load todos from localStorage
  const loadTodos = () => {
    try {
      const stored = localStorage.getItem('todos');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load todos:', error);
      return [];
    }
  };
  
  const todos = lens.useRefraction(loadTodos());
  const filter = lens.useRefraction('all'); // all, active, completed
  const searchTerm = lens.useRefraction('');
  const newTodoText = lens.useRefraction('');
  const selectedCategory = lens.useRefraction('general');
  
  // Save todos to localStorage whenever they change
  lens.useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos.value));
    } catch (error) {
      console.warn('Failed to save todos:', error);
    }
  }, [todos.value]);
  
  // Filtered todos based on current filter and search
  const filteredTodos = lens.useDerived(() => {
    let filtered = todos.value;
    
    // Apply status filter
    if (filter.value === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter.value === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }
    
    // Apply search filter
    if (searchTerm.value) {
      const search = searchTerm.value.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(search) ||
        todo.category.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }, [todos.value, filter.value, searchTerm.value]);
  
  // Statistics
  const stats = lens.useDerived(() => {
    const total = todos.value.length;
    const completed = todos.value.filter(todo => todo.completed).length;
    const active = total - completed;
    
    return { total, completed, active };
  }, [todos.value]);
  
  const addTodo = () => {
    if (!newTodoText.value.trim()) return;
    
    const newTodo = new Todo(newTodoText.value.trim(), selectedCategory.value);
    todos.set(prev => [...prev, newTodo]);
    newTodoText.set('');
  };
  
  const toggleTodo = (id) => {
    todos.set(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    todos.set(prev => prev.filter(todo => todo.id !== id));
  };
  
  const editTodo = (id, newText) => {
    if (!newText.trim()) return;
    
    todos.set(prev => prev.map(todo => 
      todo.id === id ? { ...todo, text: newText.trim() } : todo
    ));
  };
  
  const toggleAll = () => {
    const allCompleted = todos.value.every(todo => todo.completed);
    todos.set(prev => prev.map(todo => ({ 
      ...todo, 
      completed: !allCompleted 
    })));
  };
  
  const clearCompleted = () => {
    todos.set(prev => prev.filter(todo => !todo.completed));
  };
  
  const categories = lens.useDerived(() => {
    const cats = new Set(todos.value.map(todo => todo.category));
    return ['general', ...Array.from(cats).filter(cat => cat !== 'general')];
  }, [todos.value]);
  
  return (
    <div className="todo-app">
      <header className="todo-header">
        <h1>Todo List</h1>
        
        <div className="todo-stats">
          <span>Total: {stats.value.total}</span>
          <span>Active: {stats.value.active}</span>
          <span>Completed: {stats.value.completed}</span>
        </div>
      </header>
      
      <div className="todo-controls">
        <div className="add-todo">
          <select
            value={selectedCategory.value}
            onChange={(e) => selectedCategory.set(e.target.value)}
            className="category-select"
          >
            {categories.value.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            value={newTodoText.value}
            onChange={(e) => newTodoText.set(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          
          <button onClick={addTodo} className="btn btn-primary">
            Add
          </button>
        </div>
        
        <div className="search-filter">
          <input
            type="text"
            value={searchTerm.value}
            onChange={(e) => searchTerm.set(e.target.value)}
            placeholder="Search todos..."
            className="search-input"
          />
          
          <div className="filter-buttons">
            {['all', 'active', 'completed'].map(filterType => (
              <button
                key={filterType}
                onClick={() => filter.set(filterType)}
                className={`btn ${filter.value === filterType ? 'btn-active' : 'btn-secondary'}`}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bulk-actions">
          <button onClick={toggleAll} className="btn btn-outline">
            Toggle All
          </button>
          <button onClick={clearCompleted} className="btn btn-danger">
            Clear Completed
          </button>
        </div>
      </div>
      
      <div className="todo-list">
        {filteredTodos.value.length === 0 ? (
          <div className="empty-state">
            {searchTerm.value ? 'No todos match your search' : 'No todos yet'}
          </div>
        ) : (
          filteredTodos.value.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))
        )}
      </div>
    </div>
  );
});

export default TodoList;
```

## Step 3: Styling

```css
/* src/styles/TodoList.css */
.todo-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.todo-header {
  text-align: center;
  margin-bottom: 2rem;
}

.todo-header h1 {
  color: #2d3748;
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
}

.todo-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: #718096;
  font-size: 0.9rem;
}

.todo-controls {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-todo {
  display: flex;
  gap: 0.5rem;
}

.category-select {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  min-width: 120px;
}

.todo-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.todo-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.search-filter {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.bulk-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #4299e1;
  color: white;
}

.btn-primary:hover {
  background: #3182ce;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-active {
  background: #4299e1;
  color: white;
}

.btn-outline {
  background: transparent;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-danger {
  background: #f56565;
  color: white;
}

.btn-danger:hover {
  background: #e53e3e;
}

.todo-list {
  min-height: 200px;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background: #f7fafc;
  transition: all 0.2s ease;
}

.todo-item:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.todo-item.completed {
  opacity: 0.6;
  background: #f0fff4;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-text {
  flex: 1;
  cursor: pointer;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
}

.todo-category {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.todo-edit-input {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #4299e1;
  border-radius: 4px;
  font-size: 1rem;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-edit:hover {
  background: #e2e8f0;
}

.btn-delete:hover {
  background: #fed7d7;
}

.empty-state {
  text-align: center;
  color: #718096;
  font-style: italic;
  padding: 3rem;
}

@media (max-width: 768px) {
  .todo-app {
    margin: 1rem;
    padding: 1rem;
  }
  
  .add-todo {
    flex-direction: column;
  }
  
  .search-filter {
    flex-direction: column;
    align-items: stretch;
  }
  
  .todo-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .bulk-actions {
    flex-direction: column;
  }
}
```

## Step 4: Advanced Features

### Add Drag and Drop

```javascript
// src/components/DraggableTodoItem.js
import { createComponent } from 'refract';
import TodoItem from './TodoItem';

const DraggableTodoItem = createComponent(({ lens, todo, index, onToggle, onDelete, onEdit, onReorder }) => {
  const isDragging = lens.useRefraction(false);
  
  const handleDragStart = (e) => {
    isDragging.set(true);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnd = () => {
    isDragging.set(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (draggedIndex !== index) {
      onReorder(draggedIndex, index);
    }
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`draggable-todo ${isDragging.value ? 'dragging' : ''}`}
    >
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </div>
  );
});

export default DraggableTodoItem;
```

### Add Categories Management

```javascript
// src/components/CategoryManager.js
import { createComponent } from 'refract';

const CategoryManager = createComponent(({ lens, categories, onAddCategory, onDeleteCategory }) => {
  const newCategory = lens.useRefraction('');
  const isOpen = lens.useRefraction(false);
  
  const addCategory = () => {
    if (newCategory.value.trim() && !categories.includes(newCategory.value)) {
      onAddCategory(newCategory.value.trim());
      newCategory.set('');
    }
  };
  
  return (
    <div className="category-manager">
      <button 
        onClick={() => isOpen.set(!isOpen.value)}
        className="btn btn-outline"
      >
        Manage Categories
      </button>
      
      {isOpen.value && (
        <div className="category-panel">
          <div className="add-category">
            <input
              type="text"
              value={newCategory.value}
              onChange={(e) => newCategory.set(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              placeholder="New category name"
              className="category-input"
            />
            <button onClick={addCategory} className="btn btn-primary">
              Add
            </button>
          </div>
          
          <div className="category-list">
            {categories.filter(cat => cat !== 'general').map(category => (
              <div key={category} className="category-item">
                <span>{category}</span>
                <button
                  onClick={() => onDeleteCategory(category)}
                  className="btn btn-delete"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default CategoryManager;
```

## Step 5: Final Integration

```javascript
// src/App.js
import { createComponent } from 'refract';
import TodoList from './components/TodoList';
import './styles/TodoList.css';

const App = createComponent(({ lens }) => {
  return (
    <div className="app">
      <TodoList />
    </div>
  );
});

export default App;
```

## What You've Learned

This tutorial covered:

### Advanced State Management
- Complex state with multiple related values
- Derived state for filtering and statistics
- State persistence with localStorage

### Component Patterns
- Container/Presentational component separation
- Prop drilling and callback patterns
- Conditional rendering and dynamic lists

### User Experience
- Real-time search and filtering
- Inline editing with keyboard shortcuts
- Bulk operations and batch updates
- Responsive design principles

### Data Modeling
- Object-oriented todo model
- Category management
- Timestamp tracking

## Next Steps

Enhance your todo app with:

1. **Due Dates**: Add date picker and sorting by due date
2. **Priority Levels**: High, medium, low priority with visual indicators
3. **Subtasks**: Nested todo items with progress tracking
4. **Tags**: Multiple tags per todo with tag-based filtering
5. **Export/Import**: JSON/CSV export and import functionality
6. **Collaboration**: Real-time sync with other users
7. **Offline Support**: Service worker for offline functionality

## Additional Resources

- [Refract State Management Guide](../concepts/refractions)
- [Component Composition Patterns](../concepts/components)
- [Performance Optimization](../advanced/performance)
