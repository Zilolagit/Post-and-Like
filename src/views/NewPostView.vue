<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2>New post</h2>
        <form @submit.prevent="addPost">
          <div class="mb-3">
            <label for="postTitle" class="form-label"> Post title </label>
            <input
              type="text"
              v-model="title"
              class="form-control"
              id="postTitle"
            />
          </div>
          <div class="mb-3">
            <label for="postBody" class="form-label"> Post body </label>
            <textarea
              id="postBody"
              class="form-control"
              v-model="body"
              rows="10"
            ></textarea>
          </div>
          <!-- <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" />
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div> -->
          <button type="submit" class="btn btn-primary">Add</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { mapStores } from "pinia";
import { useAuthStore } from "@/stores/auth";

export default {
  data() {
    return {
      title: "",
      body: "",
    };
  },
    computed: {
    ...mapStores(useAuthStore),
  },
  methods: {
    async addPost() {
      try {
        const response = await axios.post("/api/v1/blog/posts/", {
          title: this.title,
          body: this.body,
        });
        this.$router.push("/");
      } catch (error) {
        if (error.response) {
          if (error.response.status == 400) {
            for (let key in error.response.data) {
              toast.error(`${key}: ${error.response.data[key]}`, {
                autoClose: 2000,
                theme: "colored",
              });
            }
          } else if (error.response.status == 401) {
            this.authStore.logout();
            this.$router.push("/login");
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

<style>
</style>