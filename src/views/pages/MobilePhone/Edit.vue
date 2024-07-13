<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useBaseStore } from "@/store/index.js";
import VAutoComplete from "@components/VAutoComplete.vue";
import { inject } from "vue";

const { proxy } = getCurrentInstance();
const swal = inject("$swal");
const store = useBaseStore();

const router = useRouter();

const route = useRoute();
const mobilePhoneId = route.params.mobilePhoneId;

const errorMsg = ref("");
const file = ref(null);

const mobilePhone = ref({
  variants: [],
  charger: 0,
  ram: 0,
  battery: 0,
});

const variant = ref({
  color: {},
  rom: {},
  stock: 0,
  price: 0,
  mobilePhone: {
    id: mobilePhoneId,
  },
});

const colorsAvailable = ref([]);
const CategoriesAvailable = ref([]);
const romAvailable = ref([]);

onMounted(() => {
  proxy.$api
    .get("/api/colors")
    .then((res) => {
      colorsAvailable.value = res.result;
    })
    .catch((error) => console.log(error));

  proxy.$api
    .get("/api/rom")
    .then((res) => {
      romAvailable.value = res.result;
    })
    .catch((error) => console.log(error));

  proxy.$api
    .get("/api/categories")
    .then((res) => {
      CategoriesAvailable.value = res.result;
    })
    .catch((error) => console.log(error));

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

function handleFileUpload(event) {
  file.value = event.target.files[0];
}

async function submitFile() {
  let formData = new FormData();

  formData.append("image", file.value);
  await proxy.$api
    .postFile("/cloudinary/upload", formData)
    .then((res) => {
      variant.value.image = res.url;
    })
    .catch((error) => console.log(error));
}

//#region
const errorMsgVariant = ref("");
function isValidVariant() {
  let color = variant.value.color;
  let rom = variant.value.rom;
  let stock = variant.value.stock;
  let price = variant.value.price;
  if (
    Object.keys(color).length === 0 ||
    Object.keys(rom).length === 0 ||
    stock.trim() === "" ||
    price.trim() === ""
  ) {
    errorMsgVariant.value = "Bạn phải nhập đầy đủ các trường của biến thể!";
    return false;
  }
  if (!/^[0-9]\d*$/.test(variant.value.stock)) {
    errorMsgVariant.value = "Số lượng tồn phải nhập là số";
    return false;
  }
  if (!/^[0-9]\d*$/.test(variant.value.price)) {
    errorMsgVariant.value = "Giá phải nhập là số";
    return false;
  }

  return true;
}

// them bien the
async function addVariant() {
  if (!isValidVariant()) return;

  if (file.value !== null) {
    await submitFile();
  } else {
    errorMsgVariant.value = "Bạn phải thêm ảnh";
    return;
  }

  mobilePhone.value.variants.push(variant.value);
  swal.fire({
    title: "Thêm biến thể thành công!",
    icon: "success",
  });
}

//xoa bien the
function deleteVariant(variant) {
  let index = mobilePhone.value.variants.indexOf(variant);
  mobilePhone.value.variants.splice(index, 1);
}
//#endregion

//#region
function isValidMobilePhone() {
  let mobilePhoneVal = mobilePhone.value;
  if (
    mobilePhoneVal.name === undefined ||
    mobilePhoneVal.name.trim() === "" ||
    mobilePhoneVal.frontCamera === undefined ||
    mobilePhoneVal.frontCamera.trim() === "" ||
    mobilePhoneVal.rearCamera === undefined ||
    mobilePhoneVal.rearCamera.trim() === "" ||
    mobilePhoneVal.cpu === undefined ||
    mobilePhoneVal.cpu.trim() === "" ||
    mobilePhoneVal.battery === "" ||
    mobilePhoneVal.screen === undefined ||
    mobilePhoneVal.screen.trim() === "" ||
    mobilePhoneVal.resolution === undefined ||
    mobilePhoneVal.resolution.trim() === "" ||
    mobilePhoneVal.ram === "" ||
    mobilePhoneVal.memoryStick === undefined ||
    mobilePhoneVal.memoryStick.trim() === "" ||
    mobilePhoneVal.sim === undefined ||
    mobilePhoneVal.sim.trim() === "" ||
    mobilePhoneVal.operatingSystem === undefined ||
    mobilePhoneVal.operatingSystem.trim() === "" ||
    mobilePhoneVal.size === undefined ||
    mobilePhoneVal.size.trim() === "" ||
    mobilePhoneVal.weight === undefined ||
    mobilePhoneVal.weight.trim() === "" ||
    mobilePhoneVal.charger === "" ||
    mobilePhoneVal.brand === undefined ||
    mobilePhoneVal.brand.trim() === "" ||
    mobilePhoneVal.status === undefined ||
    mobilePhoneVal.status.trim() === "" ||
    Object.keys(mobilePhoneVal.variants).length === 0
  ) {
    errorMsg.value = "Bạn phải nhập đầy đủ các trường!";
    return false;
  }

  if (!/^[1-9]\d*$/.test(mobilePhoneVal.battery)) {
    errorMsg.value = "Thông số Pin phải nhập là số lớn hơn 0";
    return false;
  }
  if (!/^[1-9]\d*$/.test(mobilePhoneVal.ram)) {
    errorMsg.value = "Thông số RAM phải nhập là số lớn hơn 0";
    return false;
  }
  if (!/^[1-9]\d*$/.test(mobilePhoneVal.charger)) {
    errorMsg.value = "Thông số sạc phải nhập là số lớn hơn 0";
    return false;
  }

  return true;
}

async function updateMobilePhone() {
  errorMsg.value = "";
  if (!isValidMobilePhone()) return;

  await proxy.$api
    .put("/api/mobilePhones/" + mobilePhoneId, mobilePhone.value)
    .then((res) => {
      if (res.message) {
        errorMsg.value = res.message;
      } else {
        console.log("Cập nhật thành công!");
        router.push("/mobilePhones");
      }
    })
    .catch((error) => console.log(error));
}
//#endregion
</script>

<template>
  <div class="card mt-4">
    <div class="card-header pb-0">
      <div class="d-flex align-items-center">
        <p class="mb-0">Thêm mới</p>
      </div>
    </div>
    <div class="card-body">
      <p class="text-uppercase text-sm">Thông tin người dùng</p>
      <form
        class="mt-8 space-y-6 mb-4"
        enctype="multipart/form-data"
        method="POST"
        @submit.prevent="updateMobilePhone"
      >
        <div class="row">
          <div class="col-md-6 text-start mb-4">
            <label for="name-text-input" class="form-label"
              >Tên điện thoại</label
            >
            <input
              v-model="mobilePhone.name"
              id="name-text-input"
              class="form-control"
              type="text"
              placeholder="Tên điện thoại"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="frontCamera-text-input" class="form-label"
              >Camera trước</label
            >
            <input
              v-model="mobilePhone.frontCamera"
              id="frontCamera-text-input"
              class="form-control"
              type="text"
              placeholder="Camera trước"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="rearCamera-text-input" class="form-label"
              >Camera sau</label
            >
            <input
              v-model="mobilePhone.rearCamera"
              id="rearCamera-text-input"
              class="form-control"
              type="text"
              placeholder="Camera sau"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="CPU-text-input" class="form-label">CPU</label>
            <input
              v-model="mobilePhone.cpu"
              id="CPU-text-input"
              class="form-control"
              type="text"
              placeholder="CPU"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="battery-text-input" class="form-label">Pin (mAh)</label>
            <input
              v-model="mobilePhone.battery"
              id="battery-text-input"
              class="form-control"
              type="text"
              placeholder="battery"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="screen-text-input" class="form-label">Màn hình</label>
            <input
              v-model="mobilePhone.screen"
              id="screen-text-input"
              class="form-control"
              type="text"
              placeholder="Màn hình"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="resolution-text-input" class="form-label"
              >Độ phân giải</label
            >
            <input
              v-model="mobilePhone.resolution"
              id="resolution-text-input"
              class="form-control"
              type="text"
              placeholder="Độ phân giải"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="RAM-text-input" class="form-label">RAM (GB)</label>
            <input
              v-model="mobilePhone.ram"
              id="RAM-text-input"
              class="form-control"
              type="text"
              placeholder="RAM"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="memoryStick-text-input" class="form-label"
              >Thẻ nhớ</label
            >
            <input
              v-model="mobilePhone.memoryStick"
              id="memoryStick-text-input"
              class="form-control"
              type="text"
              placeholder="Thẻ nhớ"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="sim-text-input" class="form-label">Sim</label>
            <input
              v-model="mobilePhone.sim"
              id="sim-text-input"
              class="form-control"
              type="text"
              placeholder="Sim"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="operatingSystem-text-input" class="form-label"
              >Hệ điều hành</label
            >
            <input
              v-model="mobilePhone.operatingSystem"
              id="operatingSystem-text-input"
              class="form-control"
              type="text"
              placeholder="Hệ điều hành"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="size-text-input" class="form-label">Kích thước</label>
            <input
              v-model="mobilePhone.size"
              id="size-text-input"
              class="form-control"
              type="text"
              placeholder="Kích thước"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="weight-text-input" class="form-label"
              >Trọng lượng</label
            >
            <input
              v-model="mobilePhone.weight"
              id="weight-text-input"
              class="form-control"
              type="text"
              placeholder="Trọng lượng"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="charger-text-input" class="form-label">Sạc(W)</label>
            <input
              v-model="mobilePhone.charger"
              id="charger-text-input"
              class="form-control"
              type="text"
              placeholder="Sạc"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="brand-text-input" class="form-label">Thương hiệu</label>
            <input
              v-model="mobilePhone.brand"
              id="brand-text-input"
              class="form-control"
              type="text"
              placeholder="Thương hiệu"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="status-text-input" class="form-label">Trạng thái</label>
            <input
              v-model="mobilePhone.status"
              id="status-text-input"
              class="form-control"
              type="text"
              placeholder="Trạng thái"
            />
          </div>
          <div class="btn-group col-md-6 mb-4">
            <v-auto-complete
              v-model="mobilePhone.category"
              :listItem="CategoriesAvailable"
              label="Chọn dòng sản phẩm"
              :isMultiple="false"
            >
            </v-auto-complete>
          </div>
          <div class="d-flex flex-wrap col-md-12 mb-4">
            <div class="btn-group col-md-2">
              <v-auto-complete
                class="mr-2"
                v-model="variant.color"
                :listItem="colorsAvailable"
                label="Chọn màu"
                :isMultiple="false"
              >
              </v-auto-complete>
            </div>
            <div class="btn-group col-md-2">
              <v-auto-complete
                v-model="variant.rom"
                class="mr-2"
                :listItem="romAvailable"
                label="Chọn ROM"
                :isMultiple="false"
                :title="'capacity'"
              >
              </v-auto-complete>
            </div>
            <div class="col-md-2 text-start">
              <div class="mr-2">
                <label for="stock-text-input" class="form-label"
                  >Số lượng</label
                >
                <input
                  v-model="variant.stock"
                  id="stock-text-input"
                  class="form-control"
                  type="text"
                  placeholder="Số lượng"
                />
              </div>
            </div>
            <div class="col-md-2 text-start mb-4">
              <div class="mr-2">
                <label for="price-text-input" class="form-label">Giá</label>
                <input
                  v-model="variant.price"
                  id="price-text-input"
                  class="form-control"
                  type="text"
                  placeholder="Giá"
                />
              </div>
            </div>
            <div class="col-md-3 mb-3 text-start">
              <div class="align-top">
                <label for="formFile" class="form-label cursor-pointer h-100"
                  >Chọn ảnh</label
                >
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  accept=".png, .jpg, .jpeg"
                  @change="handleFileUpload($event)"
                />
              </div>
            </div>
            <div class="col-md-1 mb-3 d-flex align-center justify-center">
              <div class="cursor-pointer" @click="addVariant()">
                <font-awesome-icon
                  class="h-7 w-7 border-w-sm border-zinc-700 rounded-circle text-blue-lighten-2"
                  :icon="['fas', 'plus']"
                />
                <v-tooltip activator="parent" location="bottom">
                  Thêm biến thể
                </v-tooltip>
              </div>
            </div>
            <div
              class="col-md-6 table-responsive"
              v-if="mobilePhone.variants.length > 0"
            >
              <table class="table table-striped">
                <thead class="table-dark">
                  <tr>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    >
                      Màu
                    </th>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    >
                      ROM
                    </th>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    >
                      Số lượng
                    </th>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    >
                      Giá
                    </th>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    >
                      Link ảnh
                    </th>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="variant in mobilePhone.variants">
                    <tr>
                      <td
                        class="align-middle text-start text-sm text-body-table"
                      >
                        <p class="text-xs text-body-table mb-0 text-start">
                          {{ variant.color.name }}
                        </p>
                      </td>
                      <td class="align-middle text-start text-sm">
                        <p class="text-xs text-body-table mb-0 text-start">
                          {{ variant.rom.capacity }}
                        </p>
                      </td>
                      <td class="align-middle text-start text-sm">
                        <p class="text-xs text-body-table mb-0 text-start">
                          {{ variant.stock }}
                        </p>
                      </td>
                      <td class="align-middle text-start text-sm">
                        <p class="text-xs text-body-table mb-0 text-start">
                          {{ variant.price }}
                        </p>
                      </td>
                      <td class="align-middle text-start text-sm">
                        <p class="text-xs text-body-table mb-0 text-start">
                          {{ variant.image }}
                        </p>
                      </td>
                      <td class="align-middle text-start text-sm">
                        <div class="text-red" @click="deleteVariant(variant)">
                          <font-awesome-icon :icon="['fas', 'trash-can']" />
                        </div>
                        <v-tooltip activator="parent" location="bottom">
                          Xoá biến thể
                        </v-tooltip>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="text-start text-red" v-if="errorMsg">
          {{ errorMsg }}
        </div>

        <div class="d-flex justify-start align-center">
          <button
            type="submit"
            class="btn btn-submit bg-gradient-submit py-3 mr-3"
          >
            Lưu
          </button>
          <span class="text-secondary cursor-pointer" @click="returnTable()">
            Quay lại
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-control {
  box-shadow: none;
}
</style>