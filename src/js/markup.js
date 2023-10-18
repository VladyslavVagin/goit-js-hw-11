// HTML MARKUP OF GALLERY CARDS 

export function createGallery(item) {
  return `<div class="photo-card">
  <a href="${item.largeImageURL}" data-fancybox="gallery"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
   <div class="info">
     <p class="info-item">${item.likes}
       <b>Likes</b>
     </p>
     <p class="info-item">${item.views}
       <b>Views</b>
     </p>
     <p class="info-item">${item.comments}
       <b>Comments</b>
     </p>
     <p class="info-item">${item.downloads}
       <b>Downloads</b>
     </p>
   </div>
  </div>`;
}