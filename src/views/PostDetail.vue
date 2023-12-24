<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <template v-if="post?.owner.id !== +authStore.id">
          <h2>{{ post?.title }}</h2>
          <p>{{ post?.body }}</p>
          <small v-if="post">
            {{
              new Date(post?.created_at).toLocaleString("en-GB", {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              })
            }}
          </small>
          <h4 v-if="post?.owner">
            Author: {{ post?.owner.first_name }} {{ post?.owner.last_name }}
          </h4>
          <div
            v-if="post"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              cursor: pointer;
            "
            @click="reactPost"
          >
            <svg
              v-if="post.likes.map((u) => u.id).includes(+authStore.id)"
              class="text-danger"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412q-.975 1.313-2.625 2.963T13.45 19.7L12 21Z"
              />
            </svg>
            <svg
              v-else
              class="text-danger"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412q-.975 1.313-2.625 2.963T13.45 19.7L12 21Zm0-2.7q2.4-2.15 3.95-3.688t2.45-2.674q.9-1.138 1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.688T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025q.9 1.137 2.45 2.675T12 18.3Zm0-6.825Z"
              />
            </svg>
            <p class="m-0">Liked: {{ post.likes.length }}</p>
          </div>
        </template>
        <template v-else>
          <form @submit.prevent="editPost" ref="editForm">
            <div class="mb-3">
              <label for="postTitle" class="form-label"> Post title </label>
              <input
                type="text"
                v-model="post.title"
                class="form-control"
                id="postTitle"
              />
            </div>
            <div class="mb-3">
              <label for="postBody" class="form-label"> Post body </label>
              <textarea
                id="postBody"
                class="form-control"
                v-model="post.body"
                rows="10"
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
            <button
              type="button"
              class="btn btn-danger"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Delete
            </button>
          </form>
          <div>
            <h3>Liked users</h3>
            <p v-for="user in post.likes" :key="user.id">
              <RouterLink :to="`/user/${user.id}`">{{ user.first_name }} {{ user.last_name }}</RouterLink>
            </p>
            <p v-if="post.likes.length == 0">No liked users</p>
          </div>
        </template>
        <div style="cursor: pointer" @click="copyUrl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m21 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19l7-7Z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Confrim delete
            </h1>
            <button
              ref="modalCloseBtn"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete the post?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deletePost">
              Delete post
            </button>
          </div>
        </div>
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
      post: null,
    };
  },
  computed: {
    ...mapStores(useAuthStore),
  },
  async mounted() {
    try {
      const response = await axios.get(
        `/api/v1/blog/posts/${this.$route.params.postid}/`
      );
      this.post = response.data;
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
  methods: {
    async editPost() {
      try {
        const response = await axios.put(
          `/api/v1/blog/posts/${this.$route.params.postid}/`,
          {
            title: this.post.title,
            body: this.post.body,
          }
        );
        // this.$router.push("/");
        toast.success("Saved!", {
          autoClose: 2000,
          theme: "colored",
        });
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
    async reactPost() {
      if (this.post.likes.map((u) => u.id).includes(+this.authStore.id)) {
        this.post.likes = this.post.likes.filter(
          (u) => u.id != +this.authStore.id
        );
      } else {
        this.post.likes.push({
          id: +this.authStore.id,
          first_name: this.authStore.first_name,
          last_name: this.authStore.last_name,
        });
      }
      const response = await axios.post(
        `/api/v1/blog/posts/${this.post.id}/react/`
      );
      console.log(response.data);
    },
    async deletePost() {
      try {
        const response = await axios.delete(
          `/api/v1/blog/posts/${this.$route.params.postid}/`
        );
        setTimeout(() => {
          this.$router.push("/");
        }, 1500);
        toast.success("Post deleted!", {
          autoClose: 2000,
          theme: "colored",
        });
        this.$refs.modalCloseBtn.click();
        this.$refs.editForm.reset();
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
    copyUrl() {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Copied!", {
        autoClose: 2000,
        theme: "colored",
      });
    },
  },
};
</script>

<style>
</style>