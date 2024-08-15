# Installing Webfonts
Follow these simple Steps.

## 1.
Put `nippo/` Folder into a Folder called `fonts/`.

## 2.
Put `nippo.css` into your `css/` Folder.

## 3. (Optional)
You may adapt the `url('path')` in `nippo.css` depends on your Website Filesystem.

## 4.
Import `nippo.css` at the top of you main Stylesheet.

```
@import url('nippo.css');
```

## 5.
You are now ready to use the following Rules in your CSS to specify each Font Style:
```
font-family: Nippo-Extralight;
font-family: Nippo-Light;
font-family: Nippo-Regular;
font-family: Nippo-Medium;
font-family: Nippo-Bold;
font-family: Nippo-Variable;

```
## 6. (Optional)
Use `font-variation-settings` rule to controll axes of variable fonts:
wght 700.0

Available axes:
'wght' (range from 200.0 to 700.0

