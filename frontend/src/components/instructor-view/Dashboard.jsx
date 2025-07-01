"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";
import { useInstructorContext } from "../../context/instructor-context";
import { useEffect } from "react";

function InstructorDashboard() {
	const { instructorCoursesList } = useInstructorContext();

 

	const { totalStudents, totalProfit, studentList } = calculateTotalStudentsAndProfit(instructorCoursesList);

	const config = [
		{
			icon: Users,
			label: "Total Students",
			value: totalStudents,
		},
		{
			icon: DollarSign,
			label: "Total Revenue",
			value: `$${totalProfit.toFixed(2)}`,
		},
	];

	useEffect(()=>{
		console.log("dashboard",studentList);
	   },[])

	   useEffect(()=>{
		console.log("courses",instructorCoursesList);
	   },[])
	

	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				{config.map((item, index) => (
					<Card key={index} className="bg-[#152647] text-text">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-lg font-medium">{item.label}</CardTitle>
							<item.icon className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{item.value}</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card className="bg-[#152647] text-text">
				<CardHeader>
					<CardTitle className="text-lg">Students List</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table className="w-full">
							<TableHeader>
								<TableRow>
									<TableHead className="text-text">Course Name</TableHead>
									<TableHead className="text-text">Student Name</TableHead>
									<TableHead className="text-text">Student Email</TableHead>
									<TableHead className="text-text">Attendance</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{studentList.map((studentItem, index) => (
									<TableRow key={index}>
										<TableCell className="font-medium">{studentItem.courseTitle}</TableCell>
										<TableCell>{studentItem.studentName}</TableCell>
										<TableCell>{studentItem.studentEmail}</TableCell>
										<TableCell>{studentItem?.attendance.toFixed(2)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function calculateTotalStudentsAndProfit(courses) {
	return courses.reduce(
		(acc, course) => {
			const studentCount = course.students?.length || 0;
			acc.totalStudents += studentCount;
			acc.totalProfit += course.pricing * studentCount;

			course.students?.forEach((student) => {
				acc.studentList.push({
					courseTitle: course.title,
					studentName: student.studentName,
					studentEmail: student.studentEmail,
					attendance : student.attendance,
				});
			});

			return acc;
		},
		{
			totalStudents: 0,
			totalProfit: 0,
			studentList: [],
		}
	);
}

export default InstructorDashboard;
