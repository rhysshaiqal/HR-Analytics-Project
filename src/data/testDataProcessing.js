import { 
  loadCsvData, 
  processEmployeeData, 
  createDepartmentData, 
  createJobRoleData,
  createQuarterlyPerformanceData,
  createFeatureImportanceData
} from './dataProcessor.js';

async function testDataProcessing() {
  try {
    console.log('Starting data processing test...');
    
    // 1. Test CSV loading
    console.log('\n1. Loading CSV data...');
    const csvData = await loadCsvData('./WA_FnUseC_HREmployeeAttrition.csv');
    console.log(`Successfully loaded ${csvData.length} employee records`);
    console.log('Sample record:', csvData[0]);
    
    // 2. Test employee data processing
    console.log('\n2. Processing employee data...');
    const attritionPredictions = csvData.map(() => Math.random());
    const retentionDecisions = csvData.map(emp => 
      (Math.random() > 0.75 || emp.PerformanceRating < 3) ? 'Let Go' : 'Keep'
    );
    
    const employeeData = processEmployeeData(csvData, attritionPredictions, retentionDecisions);
    console.log(`Processed ${employeeData.length} employee records`);
    console.log('Sample processed employee:', employeeData[0]);
    
    // 3. Test department data creation
    console.log('\n3. Creating department data...');
    const departmentData = createDepartmentData(employeeData);
    console.log('Department data:', departmentData);
    
    // 4. Test job role data creation
    console.log('\n4. Creating job role data...');
    const jobRoleData = createJobRoleData(employeeData);
    console.log('Job role data:', jobRoleData);
    
    // 5. Test quarterly performance data
    console.log('\n5. Creating quarterly performance data...');
    const quarterlyPerformance = createQuarterlyPerformanceData(employeeData);
    console.log('Quarterly performance data:', quarterlyPerformance);
    
    // 6. Test feature importance data
    console.log('\n6. Creating feature importance data...');
    const featureImportanceData = createFeatureImportanceData();
    console.log('Feature importance data:', featureImportanceData);
    
    console.log('\nAll tests completed successfully!');
    
  } catch (error) {
    console.error('Error during data processing test:', error);
  }
}

// Run the test
testDataProcessing(); 