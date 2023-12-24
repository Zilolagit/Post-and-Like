<template>
  <div>
    <nav v-if="!(paths.includes($route.path))" class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container">
        <RouterLink class="navbar-brand" to="/">Social Media</RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink class="nav-link" aria-current="page" to="/me/posts"
                >My Posts</RouterLink
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/me/liked-posts"
                >Liked posts</router-link
              >
            </li>
          </ul>
          <form @submit.prevent="searchPosts" class="d-flex" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              v-model="postsStore.searchTerm"
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
          <button
            class="ms-3 btn btn-outline-danger"
            type="button"
            @click="logout"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<script>
import axios from "axios";
import { mapStores } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { usePostsStore } from "@/stores/posts";

export default {
  data() {
    return {
      paths: ['/login', '/signup']
    }
  },
  computed: {
    ...mapStores(useAuthStore, usePostsStore),
  },
  mounted() {
    if (localStorage.getItem("sm-id")) {
      this.authStore.id = localStorage.getItem("sm-id");
      this.authStore.email = localStorage.getItem("sm-email");
      this.authStore.first_name = localStorage.getItem("sm-first_name");
      this.authStore.last_name = localStorage.getItem("sm-last_name");
      this.authStore.tokens = {
        access: localStorage.getItem("sm-at"),
        refresh: localStorage.getItem("sm-rt"),
      };
      axios.defaults.headers[
        "Authorization"
      ] = `Bearer ${this.authStore.tokens.access}`;
    } else {
      this.authStore.logout();
      this.$router.push("/login");
    }
  },
  watch: {
    "postsStore.searchTerm": {
      handler(value) {
        if (value == "") {
          this.searchPosts();
        }
      },
    },
  },
  methods: {
    async logout() {
      const response = await axios.post("/api/v1/auth/logout/", {
        refresh: this.authStore.tokens.refresh,
      });
      this.authStore.logout();
      this.$router.push("/login");
    },
    async searchPosts() {
      await this.$router.push(`/?search=${this.postsStore.searchTerm}`);
      this.postsStore.isLoading = true;
      try {
        const response = await axios.get(
          `/api/v1/blog/posts/?page=${this.postsStore.currentPage}&limit=${this.postsStore.perPage}&search=${this.postsStore.searchTerm}`
        );
        this.postsStore.totalPosts = response.data.count;
        this.postsStore.posts = response.data.results;
        this.postsStore.isLoading = false;
        setTimeout(() => {
          this.postsStore.styleHashtag(this.searchPosts);
        }, 100)
      } catch (error) {
        if (error.response) {
          if (error.response.status == 401) {
            this.authStore.logout();
            this.$router.push({ name: "login" });
          }
        } else {
          toast.error("Something went wrong!", {
            autoClose: 2000,
            theme: "colored",
          });
        }
      }
    },
  },
};
</script>