export const PayPalWidget = () => {
  return (
    <form action='https://www.paypal.com/cgi-bin/webscr' method='post'>
      <input type='hidden' name='cmd' value='_s-xclick' />
      <input type='hidden' name='hosted_button_id' value='26V6G9QHWXXCJ' />
      <input
        type='image'
        src='https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif'
        name='submit'
        alt='PayPal - The safer, easier way to pay online!'
      />
      <img
        alt=''
        src='https://www.paypalobjects.com/en_US/i/scr/pixel.gif'
        width='1'
        height='1'
      />
    </form>
  );
};
