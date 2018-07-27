module.exports = {
  extends: 'airbnb',
  plugins: ['react', 'jsx-a11y', 'import'],
  rules: {
    'react/jsx-filename-extension': 0,
    'indent': 0,
    'jsx-indent' :0, 
    'react/prop-types': 0,
    "react/jsx-indent" :0,
    "react/jsx-indent-props" :0,
    
  },
  globals: {
    document: 1,
  },
  parser : "babel-eslint", 
  env : {
    browser: 1
  }

};
