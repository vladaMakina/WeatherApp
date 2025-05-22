class Spinner {
   
   showSpinner = (show, hide) => {
      hide.setAttribute('hidden', '');
      show.removeAttribute('hidden');
   }

   hideSpinner = (show, hide) => {
      hide.setAttribute('hidden', '');
      show.removeAttribute('hidden');
   }
}