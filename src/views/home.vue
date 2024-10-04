<template>
  <div class="container">
    <main class="center" :class="{ 'dimmed-background': modalOpen }">
      <input
        type="search"
        class="search-input mt-5 mb-5 p-2"
        v-model="searchTerm"
        placeholder="🔍  Search for a photo"
        @keyup.enter="searchPhotos"
      />
      <!-- Display loading message while fetching results -->
      <h2 class="mb-2 heading weight-6" v-if="loading">
        Searching for <span>"{{ searchTerm }}"</span>
      </h2>

      <!-- Display search result heading when search is complete -->
      <h2 v-if="!loading && photos.length" class="mb-2 heading weight-6">
        Search results for <span>"{{ lastSearchTerm }}"</span>
      </h2>

      <!-- Image gallery section -->
      <div class="image-gallery grid-auto mb-5">
        <!-- Show skeleton loaders when loading -->
        <div
          v-if="loading"
          v-for="n in 6"
          :key="n"
          class="skeleton-item p-1 flexed-column"
        >
          <div class="skeleton-image"></div>
          <div class="skeleton-info"></div>
          <div class="skeleton-info"></div>
        </div>

        <!-- Show actual images when not loading -->
        <div
          v-else
          v-for="(photo, index) in photos"
          :key="index"
          class="image-item p-1 flexed-column"
          :style="{ backgroundImage: `url(${photo.urls.regular})` }"
          @click="openModal(photo)"
        >
          <div class="dark-overlay"></div>
          <div class="info">
            <p>Author: {{ photo.user.name }}</p>
            <p>
              Location: {{ photo.location ? photo.location.name : "Unknown" }}
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal for displaying selected image -->
    <div v-if="modalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <img :src="selectedPhoto.urls.regular" alt="Selected Photo" />
        <div class="modal-info p-2">
          <h2 class="weight-5 primary">{{ selectedPhoto.user.name }}</h2>
          <p class="secondary">
            {{ selectedPhoto.location?.name || "Unknown" }}
          </p>
        </div>
        <button class="close-btn" @click="closeModal">X</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      searchTerm: "",
      lastSearchTerm: "", // New property to store the last search term
      photos: [],
      loading: false, // State to track if search is loading
      modalOpen: false, // State to track if modal is open
      selectedPhoto: null, // State to track selected image
    };
  },
  methods: {
    async searchPhotos() {
      if (!this.searchTerm) return;

      this.loading = true; // Start loading
      this.lastSearchTerm = this.searchTerm; // Store the search term

      const accessKey = "4SDqLfD9VGpHnwHeSY0ZzW-y8ENASEdos4fW09qvl2s";
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        this.searchTerm
      )}&client_id=${accessKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.photos = data.results; // Update photos data with the results
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        this.loading = false; // End loading once images are fetched
      }
    },

    openModal(photo) {
      this.selectedPhoto = photo;
      this.modalOpen = true;
    },

    closeModal() {
      this.modalOpen = false;
      this.selectedPhoto = null;
    },
  },
};
</script>

<style scoped>
.image-gallery {
  width: 100%;
}
.image-gallery > .image-item {
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  height: 25em;
  justify-content: end;
  position: relative;
  overflow: hidden;
}
.dark-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.image-gallery > div > .info p {
  color: #fff;
}
.image-gallery > div > .info {
  position: relative;
  color: #fff;
  z-index: 2;
}

.heading {
  color: #273d5a;
}
.heading span {
  color: #6f7890;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal-content {
  background: #fefeff;
  border-radius: 16px;
  position: relative;
  width: 80%;
  max-width: 600px;
}
.modal-content > img {
  width: 100%;
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  max-height: 70vh;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #bababe;
}

/* Dimmed background when modal is open */
.dimmed-background {
  filter: blur(10px);
}
</style>
