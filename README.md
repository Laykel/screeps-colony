# Screeps code

See [screeps' site](https://screeps.com/) for more information.

The code for my colony of Creeps in typescript thanks to [@types/screeps](https://github.com/screepers/typed-screeps).

## Notes

- With this simple setup, every module has to stay at the root of `src`. This is because the game doesn't traverse through directories.

- The `build` directory `tsc` builds to is a symbolic link on my machine, pointing to `$HOME/.config/Screeps/scripts/screeps.com/main/*`.

- Type overrides from `@types/screeps` can be found in `src/index.d.ts`.
