const handleScroll = () => {
  const container = document.querySelector('.about-table-vars-container');
  const opaqueElement = document.querySelector('#opaque-el');
  const pxTolerance = 1;
  const isAtBottom =
    container.scrollHeight - container.scrollTop <= container.clientHeight - pxTolerance;

  if (opaqueElement) {
    opaqueElement.style.bottom = !isAtBottom ? `${-container.scrollTop}px` : '0';
  }
};

export { handleScroll };
