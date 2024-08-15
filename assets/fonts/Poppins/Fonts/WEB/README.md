# Installing Webfonts
Follow these simple Steps.

## 1.
Put `poppins/` Folder into a Folder called `fonts/`.

## 2.
Put `poppins.css` into your `css/` Folder.

## 3. (Optional)
You may adapt the `url('path')` in `poppins.css` depends on your Website Filesystem.

## 4.
Import `poppins.css` at the top of you main Stylesheet.

```
@import url('poppins.css');
```

## 5.
You are now ready to use the following Rules in your CSS to specify each Font Style:
```
font-family: Poppins-Thin;
font-family: Poppins-ThinItalic;
font-family: Poppins-ExtraLight;
font-family: Poppins-ExtraLightItalic;
font-family: Poppins-Light;
font-family: Poppins-LightItalic;
font-family: Poppins-Regular;
font-family: Poppins-Italic;
font-family: Poppins-Medium;
font-family: Poppins-MediumItalic;
font-family: Poppins-SemiBold;
font-family: Poppins-SemiBoldItalic;
font-family: Poppins-Bold;
font-family: Poppins-BoldItalic;
font-family: Poppins-ExtraBold;
font-family: Poppins-ExtraBoldItalic;
font-family: Poppins-Black;
font-family: Poppins-BlackItalic;
font-family: Poppins-Variable;
font-family: Poppins-VariableItalic;

```
## 6. (Optional)
Use `font-variation-settings` rule to controll axes of variable fonts:
wght 100.0

Available axes:
'wght' (range from 100.0 to 900.0

