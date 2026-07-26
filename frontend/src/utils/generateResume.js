import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { toast } from 'react-toastify';

export const generateResume = async () => {
  try {
    toast.info('Generating your resume...', { autoClose: 2000 });
    const { data } = await axios.get('/api/users/me/resume-data');
    
    const doc = new jsPDF();
    const { user, marks, tasks } = data;

    // Header
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(user.name, 15, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${user.course || user.role.toUpperCase()} | ${user.email}`, 15, 30);

    // Academic Performance
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Academic Performance", 15, 55);
    
    const marksData = marks.map(m => [
      m.Subject?.name || 'Unknown',
      m.examType.toUpperCase(),
      `${m.score} / ${m.maxScore}`
    ]);

    doc.autoTable({
      startY: 60,
      head: [['Subject', 'Exam Type', 'Score']],
      body: marksData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Completed Projects / Tasks
    const completedTasks = tasks.filter(t => t.status === 'done');
    let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 120;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Completed Projects & Tasks", 15, finalY);

    const taskData = completedTasks.map(t => [
      t.title,
      new Date(t.updatedAt).toLocaleDateString()
    ]);

    doc.autoTable({
      startY: finalY + 5,
      head: [['Task / Project', 'Completed On']],
      body: taskData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save(`${user.name.replace(/\s+/g, '_')}_Resume.pdf`);
    toast.success('Resume generated successfully!');
  } catch (err) {
    toast.error('Failed to generate resume');
    console.error(err);
  }
};
