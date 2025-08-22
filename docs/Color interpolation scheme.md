# Color interpolation scheme

Field: Content

Interpolation between colors we should count after converting it into **HSLuv color model** described here [https://github.com/hsluv/hsluv](https://github.com/hsluv/hsluv)

Tool for converting coordinates: <https://www.hsluv.org/> 
* Algorithm:** 
* Convert colors for blending into HSLuv coordinates
* Count the average between every coordinate 
  * Also, we have to be careful with H coordinate since HSL is a cylindric color space with max angle 360 degrees. So we have to determine the shortest way from one to another and find middle. 
  * Example Color 1 has Hue(1) 0, Color 2 has Hue(2) 248. So we have to convert Hue(2)=248-360=-112 and the middle between it will be Hue(1-2)= -56. To get a suitable angle we have to add 360. So we get final Hue(1-2)= -56+360=304
* Conver HSLuv coordinates into HEX back 

We still can keep colors in HEX or RGB format.  
