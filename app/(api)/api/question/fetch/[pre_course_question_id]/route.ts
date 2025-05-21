// app/(api)/api/question/fetch/[pre_course_question_id]/route.ts

import { updateQuestion, deleteQuestion } from '@/lib/actions/user.actions';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { pre_course_question_id: string } }
) {
  try {
    const id = params.pre_course_question_id;
    const body = await request.json();
    const question = await updateQuestion(id, body);
    return NextResponse.json(question);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { pre_course_question_id: string } }
) {
  try {
    const id = params.pre_course_question_id;
    await deleteQuestion(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}