//STEP 2: Mendefinisikan ID cache dan file yang perlu disimpan sebagai cache
var	CACHE_NAME	=	'static-cache';
var	urlsToCache	=	[
	'.', //semua file yg ada di root, disiapkan utk dilakukan cache
	'index.html',
	'css/resume.min.css'
];

//STEP 3: Install SW
self.addEventListener('install', function(event)	{
	event.waitUntil(
		caches.open(CACHE_NAME) //STEP 4: Membuka cache
		.then(function(cache)	{
			return	cache.addAll(urlsToCache); //STEP 5: Menambahkan semua url yang akan dimasukkan ke cache ketika cache berhasil dibuka
		})
	);
});

//STEP 6: Fetching data dari web server melalui internet jika cache belum pernah menyimpan data yang di-request
self.addEventListener('fetch', function(event)	{
	event.respondWith(
		caches.match(event.request) //STEP 7: Mengecek jika web server memiliki data yang di-request atau tidak
		.then(function(response) { //jika punya, maka berikan respon
			return	response || fetchAndCache(event.request);
		})
	);
});

/*
	STEP 8: Fungsi untuk melakukan fetching dan caching data
	Fetching dilakukan melalui URL yang mengacu ke data. Jika respon yang diberikan oleh web server tidak berstatus OK (200), maka akan diberikan pesan error "Request failed ...". Sebaliknya, maka akan membuka cache dan data yang dikirim dari web server akan diletakkan dalam cache.
*/
function fetchAndCache(url) {
	return fetch(url)
	.then(function(response) {
		//Check if we received a valid response
		if (!response.ok) {
			throw Error(response.statusText);
		}
		return caches.open(CACHE_NAME)
		.then(function(cache) {
			cache.put(url, response.clone());
			return response;
		});
	})
	.catch(function(error) {
		console.log('Request failed:', error);
		//You could return a custom	offline 404 page here
	});
}