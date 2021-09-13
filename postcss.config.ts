import autoprefixer from 'autoprefixer';
import postcssNormalize from 'postcss-normalize';
import postcssNested from 'postcss-nested';

export default {
  plugins: [
    autoprefixer,
    postcssNormalize,
    postcssNested,
  ]
}