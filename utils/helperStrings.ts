export const printScope = `
__U3oR7KbJBEI5fRlmh8 = {}

__NmU326aC4RSjLWDl9 = ['__annotations__', '__builtins__', '__cached__', '__doc__', '__file__', '__loader__', '__name__', '__package__', '__spec__']

for __tjdP5kavz7uNaSU0am in dir():
    if (__tjdP5kavz7uNaSU0am not in __NmU326aC4RSjLWDl9
        and __tjdP5kavz7uNaSU0am is not '__NmU326aC4RSjLWDl9'
        and __tjdP5kavz7uNaSU0am is not '__U3oR7KbJBEI5fRlmh8'
        and __tjdP5kavz7uNaSU0am is not '__tjdP5kavz7uNaSU0am'):
        __U3oR7KbJBEI5fRlmh8[__tjdP5kavz7uNaSU0am] = globals()[__tjdP5kavz7uNaSU0am]

print(__U3oR7KbJBEI5fRlmh8)
`;
