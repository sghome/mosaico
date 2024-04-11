$(document).ready(function() {
  generateImageMosaic();
});

function generateImageMosaic() {
  // Cargar la imagen de referencia
  var referenceImage = $('<img>').attr('src', 'https://cdn.glitch.global/c536c49d-7661-4fd9-81b8-918d12539028/DSC02533.jpeg');
  referenceImage.on('load', function() {
    var mosaicContainer = $('#mosaic-container');
    var mosaicWidth = referenceImage[0].naturalWidth;
    var mosaicHeight = referenceImage[0].naturalHeight;

    mosaicContainer.css({
      'width': mosaicWidth + 'px',
      'height': mosaicHeight + 'px',
      'background-image': 'url(' + referenceImage.attr('src') + ')'
    });

    // Obtener los datos del Google Sheets y generar el mosaico
    fetchImageData();
  });
}

function fetchImageData() {
  fetch('https://script.google.com/macros/s/AKfycbyo_y3xPXlnW96xJGU1VUlsHCiapGjQROOmwJh9HhWLcVqnNmsSas8zgx7pkFhrsAmr8g/exec')
    .then(response => response.json())
    .then(data => {
      data.forEach(user => {
        var img = $('<img>').attr('src', user.imageUrl).addClass('mosaic-image');
        $('#mosaic-container').append(img);

        img.click(function(event) {
          event.stopPropagation(); // Evitar que el clic se propague al contenedor principal
          showInfo(event, user);
        });
      });
    })
    .catch(error => {
      console.error('Error al obtener los datos del Google Sheets:', error);
    });
}

function showInfo(event, user) {
  // Mostrar información adicional al hacer clic en una imagen
  if (user) {
    alert('Nombre: ' + user.name + '\nInstagram: ' + user.instagram);
  }

  // Mostrar la imagen ampliada
  var zoomedImageContainer = $('#zoomed-image-container');
  var zoomedImage = $('#zoomed-image');

  zoomedImage.attr('src', event.target.src);
  zoomedImageContainer.fadeIn();
}

// Función para cerrar la imagen ampliada
$(document).on('click', '#zoomed-image-container', function() {
  $(this).fadeOut();
});

// Función para hacer zoom en los píxeles al hacer scroll
$('#mosaic-container').on('mousewheel', function(event) {
  event.preventDefault();
  var scale = event.originalEvent.deltaY > 0 ? 1.1 : 0.9; // Ajustar el factor de escala según el scroll
  $(this).css('transform', 'scale(' + scale + ')');
});
