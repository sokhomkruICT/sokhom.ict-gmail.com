import { Student, Teacher, AttendanceRecord, GradeRecord, Subject, TuitionRecord, SchoolInfo } from '../types';

export interface SyncDataPayload {
  schoolInfo: SchoolInfo;
  students: Student[];
  teachers: Teacher[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  subjects: Subject[];
  tuitions: TuitionRecord[];
}

export const createSchoolSpreadsheet = async (
  accessToken: string,
  title: string,
  data: SyncDataPayload
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const requestBody = {
    properties: {
      title: `${title} - ${new Date().toISOString().split('T')[0]}`,
    },
    sheets: [
      { properties: { title: 'សិស្ស_Students', gridProperties: { frozenRowCount: 1 } } },
      { properties: { title: 'គ្រូបង្រៀន_Teachers', gridProperties: { frozenRowCount: 1 } } },
      { properties: { title: 'វត្តមាន_Attendance', gridProperties: { frozenRowCount: 1 } } },
      { properties: { title: 'ពិន្ទុ_Grades', gridProperties: { frozenRowCount: 1 } } },
      { properties: { title: 'ថ្លៃសិក្សា_Tuition', gridProperties: { frozenRowCount: 1 } } },
    ],
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create Google Spreadsheet: ${errorText}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // Populate data into the newly created sheets
  await populateSpreadsheet(accessToken, spreadsheetId, data);

  return { spreadsheetId, spreadsheetUrl };
};

export const populateSpreadsheet = async (
  accessToken: string,
  spreadsheetId: string,
  data: SyncDataPayload
): Promise<void> => {
  // 1. Students sheet data
  const studentRows = [
    ['អត្តលេខ (ID)', 'ឈ្មោះខ្មែរ', 'ឈ្មោះឡាតាំង', 'ភេទ', 'ថ្ងៃខែឆ្នាំកំណើត', 'ថ្នាក់', 'បន្ទប់', 'អាណាព្យាបាល', 'ទូរស័ព្ទអាណាព្យាបាល', 'អាសយដ្ឋាន', 'ស្ថានភាព'],
    ...data.students.map((s) => [
      s.code,
      s.nameKh,
      s.nameEn,
      s.gender === 'M' ? 'ប្រុស (M)' : 'ស្រី (F)',
      s.dob,
      `ថ្នាក់ទី ${s.grade}`,
      s.section,
      s.guardianNameKh,
      s.guardianPhone,
      s.address,
      s.status,
    ]),
  ];

  // 2. Teachers sheet data
  const teacherRows = [
    ['អត្តលេខ (ID)', 'ឈ្មោះខ្មែរ', 'ឈ្មោះឡាតាំង', 'ភេទ', 'ទូរស័ព្ទ', 'អ៊ីមែល', 'មុខវិជ្ជាបង្រៀន', 'កម្រិតសញ្ញាបត្រ', 'ថ្នាក់ទទួលបន្ទុក', 'ស្ថានភាព'],
    ...data.teachers.map((t) => [
      t.code,
      t.nameKh,
      t.nameEn,
      t.gender === 'M' ? 'ប្រុស (M)' : 'ស្រី (F)',
      t.phone,
      t.email,
      t.subject,
      t.qualification,
      t.assignedClasses.join(', '),
      t.status,
    ]),
  ];

  // 3. Attendance sheet data
  const studentMap = new Map(data.students.map((s) => [s.id, s]));
  const attendanceRows = [
    ['កាលបរិច្ឆេទ', 'អត្តលេខសិស្ស', 'ឈ្មោះសិស្ស', 'ថ្នាក់', 'ស្ថានភាពវត្តមាន', 'សម្គាល់'],
    ...data.attendance.slice(-100).map((a) => {
      const s = studentMap.get(a.studentId);
      const statusLabel =
        a.status === 'present'
          ? 'វត្តមាន (Present)'
          : a.status === 'absent_excused'
          ? 'មានច្បាប់ (Excused)'
          : a.status === 'absent_unexcused'
          ? 'ឥតច្បាប់ (Unexcused)'
          : 'យឺត (Late)';
      return [
        a.date,
        s ? s.code : a.studentId,
        s ? `${s.nameKh} (${s.nameEn})` : 'N/A',
        s ? `ថ្នាក់ទី ${s.grade}${s.section}` : 'N/A',
        statusLabel,
        a.remark || '',
      ];
    }),
  ];

  // 4. Grades sheet data
  const subjectMap = new Map(data.subjects.map((sub) => [sub.id, sub]));
  const gradeRows = [
    ['ខែ', 'ឆមាស', 'អត្តលេខសិស្ស', 'ឈ្មោះសិស្ស', 'ថ្នាក់', 'មុខវិជ្ជា', 'ពិន្ទុ', 'ពិន្ទុពេញ', 'និទ្ទេស', 'មតិយោបល់'],
    ...data.grades.slice(-150).map((g) => {
      const s = studentMap.get(g.studentId);
      const sub = subjectMap.get(g.subjectId);
      return [
        g.month,
        g.semester,
        s ? s.code : g.studentId,
        s ? `${s.nameKh} (${s.nameEn})` : 'N/A',
        s ? `ថ្នាក់ទី ${s.grade}${s.section}` : 'N/A',
        sub ? `${sub.nameKh} (${sub.nameEn})` : g.subjectId,
        g.score,
        sub ? sub.maxScore : 100,
        g.letterGrade,
        g.comment || '',
      ];
    }),
  ];

  // 5. Tuitions sheet data
  const tuitionRows = [
    ['លេខវិក្កយបត្រ', 'សិស្ស', 'ថ្នាក់', 'ការពិពណ៌នា', 'ចំនួនទឹកប្រាក់', 'រូបិយប័ណ្ណ', 'ស្ថានភាព', 'ថ្ងៃកំណត់', 'ថ្ងៃបានបង់'],
    ...data.tuitions.map((t) => {
      const s = studentMap.get(t.studentId);
      return [
        t.invoiceNumber,
        s ? `${s.nameKh} (${s.nameEn})` : 'N/A',
        s ? `ថ្នាក់ទី ${s.grade}${s.section}` : 'N/A',
        t.feeTitleKh,
        t.amount,
        t.currency,
        t.status,
        t.dueDate,
        t.paidDate || 'N/A',
      ];
    }),
  ];

  const updateBatchValues = async (range: string, values: any[][]) => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}?valueInputOption=USER_ENTERED`;
    await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    });
  };

  await Promise.all([
    updateBatchValues('សិស្ស_Students!A1', studentRows),
    updateBatchValues('គ្រូបង្រៀន_Teachers!A1', teacherRows),
    updateBatchValues('វត្តមាន_Attendance!A1', attendanceRows),
    updateBatchValues('ពិន្ទុ_Grades!A1', gradeRows),
    updateBatchValues('ថ្លៃសិក្សា_Tuition!A1', tuitionRows),
  ]);
};
