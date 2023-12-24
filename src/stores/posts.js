import { defineStore } from 'pinia'

export const usePostsStore = defineStore('posts', {
    state: () => {
        return {
            isLoading: true,
            posts: [],
            totalPosts: 0,
            perPage: 5,
            currentPage: 1,
            searchTerm: ""
        }
    },
    actions: {
        styleHashtag(callback) {
            for (let postBody of document.querySelectorAll(".post-body")) {
                postBody.innerHTML = postBody.innerText.replaceAll(
                    /#(\w+)/g,
                    '<a href="javascript:void(0)" class="hashtag">#$1</a>'
                );
            }
            for (let hashtag of document.querySelectorAll(".hashtag")) {
                hashtag.onclick = (event) => {
                    this.searchTerm = event.target.innerText.slice(1);
                    callback();
                };
            }
        }
    }
})