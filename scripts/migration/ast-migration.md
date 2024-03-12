# ast-grep patterns for migration

Format:

    search pattern ...
    replace pattern ...

## Reatom 2

### Action v2 to v3

    onAction($A,($B) => $C)
    const $A = action((ctx,$B) => $C)

## Reatom 3

### Action name from const name

    const $VAR = action ( $ARGS => { $$$FUNC } )
    const $VAR = action ( $ARGS => { $$$FUNC } , '$VAR' )
