# 

# \# Web Service Manajemen Paket Internet

# 

# Project UTS Praktikum Web Service menggunakan Node.js dan Express.js.

# 

# \## Deskripsi

# 

# API ini digunakan untuk mengelola data paket internet, seperti nama paket, harga, dan kuota.

# 

# \## Teknologi

# 

# \- Node.js

# \- Express.js

# \- JavaScript

# \- REST API

# 

# \## Instalasi

# 

# 1\. Pastikan Node.js sudah terinstal.

# 2\. Clone repository ini.

# 3\. Buka terminal di folder project.

# 4\. Jalankan perintah:

# 

# &#x20;  npm install

# 

# 5\. Jalankan server:

# 

# &#x20;  node index.js

# 

# 6\. Buka http://localhost:3000

# 

# \## Daftar Endpoint

# 

# | Method | Endpoint | Fungsi |

# |---|---|---|

# | GET | /api/paket | Melihat semua paket |

# | GET | /api/paket/:id | Melihat paket berdasarkan ID |

# | POST | /api/paket | Menambahkan paket |

# | PUT | /api/paket/:id | Memperbarui paket |

# | DELETE | /api/paket/:id | Menghapus paket |

# 

# \## Contoh Data Paket

# 

# {

# &#x20; "nama": "Paket Gaming",

# &#x20; "harga": 35000,

# &#x20; "kuota": "15 GB"

# }

# 

# \## Catatan

# 

# Data paket saat ini disimpan dalam memori aplikasi.

# Data yang ditambahkan atau diubah akan kembali ke data awal

# ketika server dimulai ulang.

# 

