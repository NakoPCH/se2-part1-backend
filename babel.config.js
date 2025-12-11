// babel.config.js
export default {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current', // Ρυθμίζεται για το τρέχον περιβάλλον Node
          },
        },
      ],
    ],
  };