# How to apply new color theme to DN.

Field: Content

As it started from this [ticket](https://kontur.fibery.io/Tasks/Task/Check-ability-to-change-application-theme-using-UI-Kit-10250 "https://kontur.fibery.io/Tasks/Task/Check-ability-to-change-application-theme-using-UI-Kit-10250"), we expect to provide Kontur Platform for external customers, and we want to be able to apply new theme to our UI.\
All UI-kit elements depend on color [palette](https://www.figma.com/file/C2TlBs45hTL0U5pqZl2n9d/Kontur-Design-System?node-id=1%3A2 "https://www.figma.com/file/C2TlBs45hTL0U5pqZl2n9d/Kontur-Design-System?node-id=1%3A2"). So the only way to change the appearance of all elements is to apply changes to palette color variables.\
Here we gonna see, how to apply [HOT](https://www.hotosm.org/ "https://www.hotosm.org/") color scheme to DN.

All the changes will be done in DISASTER-NINJA-FE repo.

At start, let's create file brand.css in `/src` folder and then go to `/src/index.ts` and import this **brand.css** in the end right after `import './global.css';` line. The idea is to override existing variables to apply new theme. 

Should look like this: 


### Font

To apply new font to all text elements: 

1) import font (1st line)

2) define —font-family variable with the name of the font

done. 🎉

### Colors

All colors are reflected in our css variables. See all of them [here](https://apps.kontur.io/ui-kit/?fixtureId=%7B%22path%22%3A%22k2-packages%2Fdefault-theme%2Fsrc%2FColors.fixture.tsx%22%2C%22name%22%3Anull%7D "https://apps.kontur.io/ui-kit/?fixtureId=%7B%22path%22%3A%22k2-packages%2Fdefault-theme%2Fsrc%2FColors.fixture.tsx%22%2C%22name%22%3Anull%7D").\
We gonna cover only specific group of them needed for rebranding DN to HOT theme. \
\
*Buttons*

For buttons accent-\* variables are used. It was blue in original DN, and becomes red in HOT DN.\
`--accent-strong: #d73f3f;`

`--accent-strong-up: #d63131;`

`--accent-strong-down: #d55353;`

`--accent-weak: #f5cfcf;`

`--accent-weak-up: #f5bbbb;`

*Text/Input/Select/Radio* 

For native html Text/Input/Select/Radio base-\* variables are used. It's a bit grey for HOT.

`--base-strong: #2c3038;`

`--base-strong-down: #2c3038de; `

*Hover*

Apart of our <Button> that has it's own hover inside (accent color), 

all other elements apply hover from --complimentary-strong-\* variables. 

Let's take dark-grey for HOT.

`--complimentary-strong: #21242a;`

`--complimentary-strong-down: #3d4148;`

*Top and left navigation bars*

For these 2 elements we have a separate variables  --brand-strong-\*.

For top panel it's --brand-strong, for left panel it's--brand-strong-down.

`--brand-strong: #21242a;`

`--brand-strong-down: #3d4148;`

If you need to modify elements other that that - feel free to investigate the rest of variables.

### Logo

In this section we gonna replace Kontur logo with another one. (top left corner of the app)


We can't set logo in css file as it's a react component, so we need to put our `hot-logo.svg` file to `public/assets` folder and then go to `src/components/KonturLogo/KonturLogo.tsx`

You need to put your logo inside <a> tag like on the screenshot.


Done! 🎉

