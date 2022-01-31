import autoprefixer from 'autoprefixer';
import postcssNormalize from 'postcss-normalize';
import postcssNested from 'postcss-nested';
import postcssCustomMedia from 'postcss-custom-media'

export default {
  plugins: [
    postcssCustomMedia({
      importFrom: './node_modules/@k2-packages/default-theme/variables.css'
    }),
    autoprefixer,
    postcssNormalize,
    postcssNested,
  ]
}