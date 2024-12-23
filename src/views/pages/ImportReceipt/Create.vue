<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useBaseStore } from "@/store/index.js";
import VAutoComplete from "@components/VAutoComplete.vue";
import { inject } from "vue";

const { proxy } = getCurrentInstance();
const swal = inject("$swal");

const router = useRouter();

const errorMsg = ref("");

const importReceipt = ref({
  note: "",
  supplierName: "",
  importReceiptDetails: [],
});

const importReceiptDetail = ref({
  quantity: 0,
  price: 0,
  variant: "",
});

const variants = ref([]);

onMounted(() => {
  proxy.$api
    .get("/api/variants?pageSize=10000&status=Đang kinh doanh")
    .then((res) => {
      variants.value = res.content;
      variants.value = variants.value.map((variant) => ({
        id: variant.id,
        name: `${variant.mobilePhone.name} ${variant.mobilePhone.ram}GB/${variant.rom.capacity}GB màu ${variant.color.name}`,
      }));
    })
    .catch((error) => console.log(error));
});

function returnTable() {
  router.push("/import-receipts");
}

//#region
const errorMsgImportReceiptDetail = ref("");
function isValidImportReceiptDetail() {
  let quantity = importReceiptDetail.value.quantity;
  let price = importReceiptDetail.value.price;
  let variant = importReceiptDetail.value.variant;
  if (Object.keys(variant).length === 0) {
    errorMsgImportReceiptDetail.value =
      "Bạn phải nhập đầy đủ các trường của sản phẩm nhập!";
    return false;
  }
  if (!/^[0-9]\d*$/.test(importReceiptDetail.value.price) || price <= 0) {
    errorMsgImportReceiptDetail.value = "Giá phải nhập là số lớn hơn 0";
    return false;
  }
  if (!/^[0-9]\d*$/.test(importReceiptDetail.value.quantity) || quantity <= 0) {
    errorMsgImportReceiptDetail.value = "Số lượng phải nhập là số lớn hơn 0";
    return false;
  }

  return true;
}

// them chi tiet phieu nhap kho
async function addImportReceiptDetail() {
  if (!isValidImportReceiptDetail()) return;

  importReceipt.value.importReceiptDetails = [
    ...importReceipt.value.importReceiptDetails,
    { ...importReceiptDetail.value },
  ];
  swal.fire({
    title: "Thêm sản phẩm thành công!",
    icon: "success",
  });
  importReceiptDetail.value.quantity = 0;
  importReceiptDetail.value.price = 0;
  importReceiptDetail.value.variant = "";
}

//xoa phieu nhap kho
function deleteImportReceiptDetail(importReceiptDetail) {
  let index =
    importReceipt.value.importReceiptDetails.indexOf(importReceiptDetail);
  importReceipt.value.importReceiptDetails.splice(index, 1);
}

//#endregion

//#region
function isValidImportReceipt() {
  let importReceiptVal = importReceipt.value;
  if (
    importReceiptVal.supplierName === undefined ||
    importReceiptVal.supplierName.trim() === ""
  ) {
    errorMsg.value = "Bạn phải nhập đầy đủ các trường!";
    return false;
  }

  if (importReceiptVal.importReceiptDetails.length === 0) {
    errorMsg.value = "Bạn thêm sản phẩm cho phiếu nhập!";
    return false;
  }

  errorMsg.value = ""
  return true;
}

async function createImportReceipt() {
  errorMsg.value = "";
  if (!isValidImportReceipt()) {
    return;
  }

  let data = importReceipt.value;
  data.importReceiptDetails = data.importReceiptDetails.map((value) => ({
    quantity: value.quantity,
    price: value.price,
    variantId: value.variant.id
  }))

  await proxy.$api
    .post("/api/import-receipts", data)
    .then((res) => {
      if (res.message) {
        errorMsg.value = res.message;
      } else {
        console.log("Thêm mới thành công!");
        router.push("/import-receipts");
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
      <p class="text-uppercase text-sm">Thông tin phiếu nhập kho</p>
      <form
        class="mt-8 space-y-6 mb-4"
        enctype="multipart/form-data"
        method="POST"
        @submit.prevent="createImportReceipt"
      >
        <div class="row">
          <div class="col-md-6 text-start mb-4">
            <label for="name-text-input" class="form-label">Nhà cung cấp</label>
            <input
              v-model="importReceipt.supplierName"
              id="name-text-input"
              class="form-control"
              type="text"
              placeholder="Nhà cung cấp"
            />
          </div>
          <div class="col-md-6 text-start mb-4">
            <label for="frontCamera-text-input" class="form-label"
              >Ghi chú</label
            >
            <input
              v-model="importReceipt.note"
              id="frontCamera-text-input"
              class="form-control"
              type="text"
              placeholder="Ghi chú"
            />
          </div>
          <div class="d-flex flex-wrap col-md-12 mb-4">
            <div class="btn-group col-md-5 text-start mb-4">
              <v-auto-complete
                v-model="importReceiptDetail.variant"
                :listItem="variants"
                label="Chọn sản phẩm"
                :isMultiple="false"
              >
              </v-auto-complete>
            </div>
            <div class="col-md-3 text-start mb-4">
              <div class="mr-2">
                <label for="price-text-input" class="form-label">Giá</label>
                <input
                  v-model="importReceiptDetail.price"
                  id="price-text-input"
                  class="form-control"
                  type="text"
                  placeholder="Giá"
                />
              </div>
            </div>
            <div class="col-md-3 text-start mb-4">
              <div class="mr-2">
                <label for="price-text-input" class="form-label"
                  >Số lượng</label
                >
                <input
                  v-model="importReceiptDetail.quantity"
                  id="price-text-input"
                  class="form-control"
                  type="text"
                  placeholder="Số lượng"
                />
              </div>
            </div>
            <div class="col-md-1 mb-3 d-flex align-center justify-center">
              <div class="cursor-pointer" @click="addImportReceiptDetail()">
                <font-awesome-icon
                  class="h-7 w-7 border-w-sm border-zinc-700 rounded-circle text-blue-lighten-2"
                  :icon="['fas', 'plus']"
                />
                <v-tooltip activator="parent" location="bottom">
                  Thêm chi tiết nhập kho
                </v-tooltip>
              </div>
            </div>
            <div class="text-start text-red" v-if="errorMsgImportReceiptDetail">
              {{ errorMsgImportReceiptDetail }}
            </div>
            <div
              class="col-md-12 table-responsive"
              v-if="importReceipt.importReceiptDetails.length > 0"
            >
              <table class="table table-striped">
                <thead class="table-dark">
                  <tr>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    >
                      Tên sản phẩm
                    </th>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    >
                      Giá
                    </th>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    >
                      Số lượng
                    </th>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="ird in importReceipt.importReceiptDetails">
                    <tr>
                      <td
                        class="align-middle text-start text-sm text-body-table"
                      >
                        <p class="text-xs text-body-table mb-0 text-start">
                          {{ ird.variant.name }}
                        </p>
                      </td>
                      <td class="align-middle text-start text-sm">
                        <p class="text-xs text-body-table mb-0 text-start">
                          {{ ird.price }}
                        </p>
                      </td>
                      <td class="align-middle text-start text-sm">
                        <p class="text-xs text-body-table mb-0 text-start">
                          {{ ird.quantity }}
                        </p>
                      </td>
                      <td class="align-middle text-start text-sm">
                        <div
                          class="text-red cursor-pointer"
                          @click="
                            deleteImportReceiptDetail(importReceiptDetail)
                          "
                        >
                          <font-awesome-icon :icon="['fas', 'trash-can']" />
                        </div>
                        <v-tooltip activator="parent" location="bottom">
                          Xoá chi tiết phiếu nhập kho
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
            Thêm mới
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
