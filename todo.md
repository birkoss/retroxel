* General
    * Popup hiding
        * Should leave the overlay until it's done
    * Find a background concept for each states
    * Find icons (Previous, Next, Help, Reload)
    * Verify the animations
        * On buttons container, maybe animate the buttons individually

* Main (state)
    * Find a name :D
    * Redo using the AnimatedState

* Puzzles (state)
    * Rename to ChoosePuzzle
    * Show the puzzle progression in button background
    * Show a preview of the puzzle in the button
    * Add a new disabled puzzle showing more to come...

* Difficulty (state)
    * Rename to ChooseDifficulty
    * Show a preview of each difficulties progression in the button background

* Level (state)
    * Rename to ChooseLevel
    * Find another way to disable the panel button
    * Find another way to show the locked puzzle

* Game (state)
    * Rename to Puzzle
    * Gameplay
        * Change the label color when the tile requirement is met
        * Highlight the lights when they illuminate another light
    * Animation
        * Light the grid on a time based delay (starting around the tile and going further)
            * Instead of simply changing the color, create another frame and scale it
            * Disable the click while doing it
    * GameOver popup
        * Hide the popup THEN do the selected action
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
