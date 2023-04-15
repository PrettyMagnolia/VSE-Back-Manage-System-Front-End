<template>
  <div class="card index-content-box">
    <el-row align="middle" justify="center">
      <el-col :span="11">
        <h2>{{ course?.courseName }}</h2>
        <el-descriptions :column="1" size="large">
          <el-descriptions-item width="400" label="课号">
            {{ course?.courseId }}
          </el-descriptions-item>

          <el-descriptions-item width="400" label="开课学年">
            {{ course?.year + ' -- ' + semester }}
          </el-descriptions-item>
        </el-descriptions>

        <p class="tag">快捷访问</p>
        <el-link type="success" class="link" :underline="false">课程通知公告</el-link>
        <el-link type="success" class="link" :underline="false">课程实验项目</el-link>
        <el-link type="success" class="link" :underline="false">实验报告评阅</el-link>
        <el-link type="success" class="link" :underline="false">学生成绩</el-link>
        <el-link type="success" class="link" :underline="false">课程人员管理</el-link>
      </el-col>

      <el-col :span="11">
        <div>
          <div ref="echartsRef" class="content-box" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
  
<script setup lang="ts" name="class">
import { Review } from '@/api/interface';
import { getCourseInfo, getStudentList } from '@/api/modules/review';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { UserInfo } from '@/stores/interface';
const echartsRef = ref<HTMLElement>();
const router = useRouter();
const routerName = router.currentRoute.value.name!.valueOf();
const courseId = (routerName as string)!.split('-')[0];
const course = ref<Review.CourseInfo>();
const stuList = ref<UserInfo[]>();
const getNetworkData = async () => {
  const { data: courseInfo } = await getCourseInfo({ courseId: Number(courseId) });
  course.value = courseInfo;
  const { data: temp } = await getStudentList({ courseId: Number(courseId) });
  stuList.value = temp
  console.log(temp);
}

onMounted(async () => {
  await getNetworkData();
  let boy = 0, girl = 0;
  stuList.value!.forEach((s) => {
    if (s.gender == "男") boy++;
    if (s.gender == "女") girl++;
  })

  let myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
  let option: echarts.EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      left: "center",
      top: "bottom",
      data: ["男", "女"],
      textStyle: {
        color: "#a1a1a1"
      }
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: "Radius Mode",
        type: "pie",
        radius: [60, 100],
        center: ["50%", "50%"],
        roseType: "radius",
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: true
        },
        emphasis: {
          label: {
            show: true
          }
        },
        data: [
          { value: boy, name: "男" },
          { value: girl, name: "女" }
        ]
      }
    ]
  };
  useEcharts(myChart, option);
  console.log(option);
});

const semester = computed(() => {
  if (course.value?.semester == 'spring') return "秋季学期";
  else return "春季学期";
})
</script>

<style scoped>
.index-content-box {
  height: 100%;
  width: 100%;
}

.tag {
  font-size: large;
  margin-top: 40px;
}

.link {
  display: block;
  margin-top: 10px;
  width: 200px;
  font-size: medium;
}
</style>