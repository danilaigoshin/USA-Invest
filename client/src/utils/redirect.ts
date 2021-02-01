export const redirect = (res: any) => {
  if (res) {
    res.writeHead(301, { Location: '/' });
    res.end();
  }
};
