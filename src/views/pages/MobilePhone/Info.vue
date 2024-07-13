<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const { proxy } = getCurrentInstance();

const router = useRouter();

const route = useRoute();
const mobilePhoneId = route.params.mobilePhoneId;

const mobilePhone = ref({});

onMounted(() => {
  proxy.$api
    .get("/api/mobilePhones/" + mobilePhoneId)
    .then((res) => {
      mobilePhone.value = res.result;
    })
    .catch((error) => console.log(error));
});

function returnTable() {
  router.push("/mobilePhones");
}
</script>

<template>
  <div class="card px-0 pt-0 pb-2">
    <div class="card-body p-5">
      <ul class="p-0 m-0 w-50">
        <li class="bg-grey-lighten-2 d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Tên sản phẩm:</span>
          <div class="d-table-cell">
            {{ mobilePhone.name }}
          </div>
        </li>
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Camera trước:</span>
          <div class="d-table-cell">
            {{ mobilePhone.frontCamera }}
          </div>
        </li>
        <li class="bg-grey-lighten-2 d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Camera sau:</span>
          <div class="d-table-cell">
            {{ mobilePhone.rearCamera }}
          </div>
        </li>
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">CPU:</span>
          <div class="d-table-cell">
            {{ mobilePhone.cpu }}
          </div>
        </li>
        <li class="bg-grey-lighten-2 d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Pin</span>
          <div class="d-table-cell">
            {{ mobilePhone.battery }}
          </div>
        </li>
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Màn hình:</span>
          <div class="d-table-cell">
            {{ mobilePhone.screen }}
          </div>
        </li>
        <li class="bg-grey-lighten-2 d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Độ phân giải:</span>
          <div class="d-table-cell">
            {{ mobilePhone.resolution }}
          </div>
        </li>
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">RAM:</span>
          <div class="d-table-cell">
            {{ mobilePhone.ram }}
          </div>
        </li>
        <li class="bg-grey-lighten-2 d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Thẻ nhớ:</span>
          <div class="d-table-cell">
            {{ mobilePhone.memoryStick }}
          </div>
        </li>
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Sim:</span>
          <div class="d-table-cell">
            {{ mobilePhone.sim }}
          </div>
        </li>
        <li class="bg-grey-lighten-2 d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Hệ điều hành:</span>
          <div class="d-table-cell">
            {{ mobilePhone.operatingSystem }}
          </div>
        </li>
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Kích thước:</span>
          <div class="d-table-cell">
            {{ mobilePhone.size }}
          </div>
        </li>
        <li class="bg-grey-lighten-2 d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Trọng lượng:</span>
          <div class="d-table-cell">
            {{ mobilePhone.weight }}
          </div>
        </li>
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Sạc:</span>
          <div class="d-table-cell">
            {{ mobilePhone.charger }}
          </div>
        </li>
        <li class="bg-grey-lighten-2 d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Thương hiệu:</span>
          <div class="d-table-cell">
            {{ mobilePhone.brand }}
          </div>
        </li>
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2"> Trạng thái:</span>
          <div class="d-table-cell">
            {{ mobilePhone.status }}
          </div>
        </li>
        <li class="w-100 position-relative">
          <v-carousel height="400" show-arrows="hover" cycle hide-delimiter-background>
            <template v-for="variant in mobilePhone.variants">
              <v-carousel-item :src="variant.image">
                <div class="position-absolute top-0 left-0 px-2">
                  <span>{{ variant.color.name + " / " +variant.rom.capacity + " GB"}}</span>
                </div>
              </v-carousel-item>
            </template>
          </v-carousel>
        </li>
      </ul>
      <div class="d-flex justify-start align-center">
        <button
          type="button"
          class="btn btn-submit bg-gradient-submit py-3 mr-3"
          @click="returnTable()"
        >
          Quay lại
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>