import { useState, useCallback } from 'react';

export interface TicketForm {
  title: string;
  description: string;
  projectId: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UseCreateTicketReturn {
  form: TicketForm;
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: Partial<Record<keyof TicketForm, string>>;
  handleChange: (field: keyof TicketForm, value: string) => void;
  handleSubmit: () => Promise<void>;
  reset: () => void;
}

const initialForm: TicketForm = {
  title: '',
  description: '',
  projectId: '',
  priority: 'medium',
};

export const useCreateTicket = (): UseCreateTicketReturn => {
  const [form, setForm] = useState<TicketForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TicketForm, string>>>({});

  const reset = useCallback(() => {
    setForm(initialForm);
    setErrors({});
    setIsSuccess(false);
  }, []);

  const handleChange = useCallback((field: keyof TicketForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const newErrors: Partial<Record<keyof TicketForm, string>> = {};

    if (!form.title || form.title.trim().length < 2) {
      newErrors.title = '제목은 필수이며 2자 이상이어야 합니다.';
    }
    if (!form.description || form.description.trim().length < 10) {
      newErrors.description = '설명은 필수이며 10자 이상이어야 합니다.';
    }
    if (!form.projectId) {
      newErrors.projectId = '프로젝트 아이디는 필수입니다.';
    }
    if (!form.priority) {
      newErrors.priority = '우선순위 선택은 필수입니다.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // [API 교체 지점] 실제 티켓 생성 API 호출을 이곳에서 처리하세요.
      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        reset();
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      console.error('티켓 생성 실패:', error);
    }
  }, [form, reset]);

  return {
    form,
    isSubmitting,
    isSuccess,
    errors,
    handleChange,
    handleSubmit,
    reset,
  };
};
