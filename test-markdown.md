# Markdown Rendering Test

This file demonstrates the enhanced markdown rendering features.

## Code Blocks with Syntax Highlighting

### JavaScript Example
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return {
    message: "Welcome",
    timestamp: new Date().toISOString()
  };
}

// Call the function
const result = greet("World");
console.log(result);
```

### Python Example
```python
def fibonacci(n):
    """Generate Fibonacci sequence up to n terms"""
    fib_sequence = [0, 1]
    
    for i in range(2, n):
        next_num = fib_sequence[i-1] + fib_sequence[i-2]
        fib_sequence.append(next_num)
    
    return fib_sequence[:n]

# Test the function
print(fibonacci(10))
```

### TypeScript with React
```typescript
interface UserProps {
  name: string;
  age: number;
  email?: string;
}

const UserCard: React.FC<UserProps> = ({ name, age, email }) => {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {email && <p>Email: {email}</p>}
    </div>
  );
};

export default UserCard;
```

## Text Formatting

### Bold Text Examples
This text contains **bold words** and **multiple bold phrases** to show enhanced font weight.

### Headers with Different Colors

# Level 1 Header - Dark and Bold
## Level 2 Header - Slightly Lighter
### Level 3 Header - Medium Gray
#### Level 4 Header - Lighter Gray
##### Level 5 Header - Light Gray
###### Level 6 Header - Lightest Gray

## Tables

| Language | Use Case | Popularity |
|----------|----------|:----------:|
| JavaScript | Web Development | ⭐⭐⭐⭐⭐ |
| Python | Data Science, AI | ⭐⭐⭐⭐⭐ |
| Java | Enterprise Apps | ⭐⭐⭐⭐ |
| Go | Cloud Services | ⭐⭐⭐ |
| Rust | Systems Programming | ⭐⭐⭐ |

### Centered Table

| Feature | Status | Notes |
|:-------:|:------:|:-----:|
| Syntax Highlighting | ✅ | Prism.js |
| Line Numbers | ✅ | With plugin |
| Bold Text | ✅ | Enhanced |
| Header Colors | ✅ | Gradient |
| Tables | ✅ | Working |

## Inline Code

You can use `inline code` like this: `const x = 42;` or `pip install numpy`.

## Mixed Content Example

Here's a function that processes **markdown** content with `syntax highlighting`:

```javascript
// Process markdown with enhanced features
const processMarkdown = (content) => {
  const enhanced = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
  
  return enhanced;
};
```

The function above demonstrates:
- **Bold text** rendering
- `Inline code` styling
- Proper syntax highlighting with line numbers

## Conclusion

All markdown enhancements are working properly! 🎉