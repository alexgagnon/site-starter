export function debug(...msg: unknown[]) {
  if (
    import.meta.env.SSR
      ? process.env.DEBUG
      : localStorage.getItem('debug') === 'true'
  ) {
    console.debug(...msg);
  }
}
