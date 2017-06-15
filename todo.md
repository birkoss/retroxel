* General
    * Find a background concept for each states
    * Find icons (Previous, Next, Help, Reload)
    * Verify the animations
        * On buttons container, maybe animate the buttons individually

* Main (state)
    * Find a name :D

* Puzzles (state)
    * Show the puzzle progression in button background
    * Show a preview of the puzzle in the button

* Difficulty (state)
    * Rename to ChooseDifficulty
    * Show a preview of each difficulties progression in the button background

* Level (state)
    * Rename to ChooseLevel
    * Find another way to disable the panel button
    * Find another way to show the locked puzzle

* Game (state)
    * Rename to Puzzle
    * Animation
        * Light the grid on a time based delay (starting around the tile and going further)
            * Instead of simply changing the color, create another frame and scale it
            * Disable the click while doing it
    * Bottom panel
        * Button HELP
            * Show the Help Popup
        * Text when error are detected
            * Show an error when a rule is broken
    * Help Popup
        * Fullscreen
        * Panel Top
            * Btn Close X, Red
            * Title: Help
        * Panel Bottom
            * Navigator (Previous, Next, and pages count)
        * Content
            * Text + Image
