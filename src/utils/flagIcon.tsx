function getFlagIcon(countryName: string): string {
  const country = countryName ? countryName.toLowerCase() : '';
  return country.replace(/\s/g, '-') === 'czech-republic'
    ? `https://api.iconify.design/emojione-v1:flag-for-czechia.svg`
    : country.replace(/\s/g, '-') === 'hong-kong'
    ? `https://api.iconify.design/emojione-v1:flag-for-hong-kong-sar-china.svg`
    : `https://api.iconify.design/emojione-v1:flag-for-${country.replace(
        /\s/g,
        '-'
      )}.svg`;
}

export { getFlagIcon };
