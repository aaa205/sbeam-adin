<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商品
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除
                </el-button>
                <el-button
                        type="primary"
                        icon="el-icon-lx-add"
                        class="handle-del mr10"
                        @click="handleAdd"
                >添加
                </el-button>
                <el-input v-model="query.kw" placeholder="名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column label="价格">
                    <template slot-scope="scope">${{scope.row.price}}</template>
                </el-table-column>
                <el-table-column prop="developer" label="开发商">
                </el-table-column>
                <el-table-column prop="publisher" label="发行商"></el-table-column>
                <el-table-column label="描述">
                    <template slot-scope="scope">{{scope.row.description.substr(0,25)}}</template>
                </el-table-column>
                <el-table-column prop="release_date" label="发售日期">
                    <template slot-scope="scope">{{new Date(scope.row.release_date)}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input-number :precision="2" :step="0.1" v-model="form.price"></el-input-number>
                </el-form-item>
                <el-form-item label="开发商">
                    <el-input v-model="form.developer"></el-input>
                </el-form-item>
                <el-form-item label="发行商">
                    <el-input v-model="form.publisher"></el-input>
                </el-form-item>
                <el-form-item label="发售日期">
                    <el-date-picker
                            v-model="form.release_date"
                            value-format="timestamp"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description" type="textarea" autosize></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加弹出框 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input-number :precision="2" :step="0.1" v-model="form.price"></el-input-number>
                </el-form-item>
                <el-form-item label="开发商">
                    <el-input v-model="form.developer"></el-input>
                </el-form-item>
                <el-form-item label="发行商">
                    <el-input v-model="form.publisher"></el-input>
                </el-form-item>
                <el-form-item label="发售日期">
                    <el-date-picker
                            v-model="form.release_date"
                            value-format="timestamp"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description" type="textarea" autosize></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { addProduct, deleteProduct, fetchProduct, updateProduct } from '../../api/index';

    export default {
        name: 'product-table',
        data() {
            return {
                query: {
                    kw:'',
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                addVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取数据
            getData() {
                fetchProduct({kw:this.query.kw}).then(res => {
                    this.tableData = res.data;
                    this.pageTotal = 1;
                });
            },
            // 搜索操作
            handleSearch(){
                this.getData({kw:this.query.kw})
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteProduct([row.id]).then(resp => {
                        if (resp.status == 200) {
                            this.$message.success('删除成功');
                            this.tableData.splice(index, 1);
                        } else {
                            this.$message.error('删除失败');
                        }
                    });
                }).catch(() => {
                });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                //上传删除的id
                let delIds = this.multipleSelection.map(i => {
                    return i.id;
                });
                deleteProduct(delIds).then(resp => {
                    if (resp.status == 200) {
                        const length = this.multipleSelection.length;
                        let str = '';
                        this.delList = this.delList.concat(this.multipleSelection);
                        for (let i = 0; i < length; i++) {
                            str += this.multipleSelection[i].name + ' ';
                        }
                        this.$message.success(`删除了${str}`);
                        //被选中元素的下标
                        let delIndex=[]
                        this.tableData.forEach((data,index)=>{
                            if(typeof(this.delList.find(del=>{return del.id==data.id}))!='undefined'){
                                delIndex.push(index)
                            }
                        })
                        console.log(delIndex);
                        delIndex.forEach(i=>{this.tableData.splice(i,1)})
                        this.multipleSelection = [];
                    } else {
                        this.$message.error(`删除失败`);
                    }
                });

            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = JSON.parse(JSON.stringify(row));
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                updateProduct(this.form).then(resp => {
                    if (resp.status == 200) {
                        this.editVisible = false;
                        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                        this.$set(this.tableData, this.idx, this.form);
                    } else {
                        this.$message.error('修改失败');
                    }
                });
            },
            //添加操作
            handleAdd() {
                this.form = {
                    name: null,
                    price: null,
                    release_date: null,
                    developer: null,
                    publisher: null,
                    description: null
                };
                this.addVisible = true;
            },
            //保存添加
            saveAdd() {
                addProduct(this.form).then(resp => {
                    if (resp.status == 200) {
                        this.addVisible = false;
                        this.$message.success('添加成功');
                        this.tableData.push(resp.data)
                    }else{
                        this.$message.error('添加失败');
                    }
                });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
