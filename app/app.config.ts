export default defineAppConfig({
  ui: {
    colors: {
      primary: '#9B1B3A',
      secondary: '#ffffff',
      text: '#333333',
      background: '#ffffff',
    },
    input: {
      slots: {
        root: 'relative flex items-stretch w-full rounded-[xl] overflow-hidden transition-all duration-200 outline-none',

        base: [
          'w-full rounded-xl border-0 appearance-none placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75',
          'transition-colors'
        ].join(' '),
      },

      variants: {
        size: {
          xs: { base: 'px-3 py-2 text-xs gap-1' },
          sm: { base: 'px-3 py-2.5 text-sm gap-1.5' },
          md: { base: 'px-[15px] py-[15px] text-sm gap-1.5' },
          lg: { base: 'px-[15px] py-[15px] text-base gap-2' },
          xl: { base: 'px-[15px] py-[15px] text-base gap-2' },
        },
      },

      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'outline',
      },
    },

    button: {
      slots: {
        base: [
          'cursor-pointer',
          'rounded-[15px] font-semibold tracking-widest flex items-center justify-center relative font-normal',
          'disabled:cursor-not-allowed aria-disabled:cursor-not-allowed',
          'disabled:opacity-75 aria-disabled:opacity-75',
          'transition-colors duration-200',
          'focus:outline-none',
        ].join(' '),
        label: 'truncate tracking-widest',
        // ✅ Add these two new slots:
        leadingIcon: '',
        trailingIcon: '',
      },

      variants: {
        color: {
          primary: '',
          secondary: '',
          neutral: '',
          ghost: '',
          white: '',
        },
        variant: {
          solid: '',
          outline: '',
          ghost: '',
          soft: '',
          link: '',
        },
        size: {
          xs: {
            base: 'px-2 py-1 text-xs gap-1.5 text-xs',
            leadingIcon: 'size-4',
            trailingIcon: 'size-4',
          },
          sm: {
            base: 'px-2.5 py-1.5 text-xs gap-1.5 text-sm',
            leadingIcon: 'size-4',
            trailingIcon: 'size-4',
          },
          md: {
            base: 'px-2.5 py-1.5 text-sm gap-1.5 ',
            leadingIcon: 'size-5',
            trailingIcon: 'size-5',
          },
          lg: {
            base: 'px-4 py-3.5 text-sm gap-2 text-base',
            leadingIcon: 'size-5',
            trailingIcon: 'size-5',
          },
          xl: {
            base: 'px-6 py-4 text-base gap-2 text-[15px]',
            leadingIcon: 'size-6',
            trailingIcon: 'size-6',
          },
        },

        block: {
          true: {
            base: 'w-full',
            // NO ms-auto here — icons stay beside the label
            label: 'flex-1 text-center',
            trailingIcon: 'absolute right-4',
          },
          false: {
            base: '',
          },
        },

        loading: { true: '' },
        square: { true: '' },
        leading: { true: '' },
        trailing: { true: '' },
        active: {
          true: { base: '' },
          false: { base: '' },
        },
      },

      compoundVariants: [
        // ── PRIMARY ──────────────────────────────────────────────────
        {
          color: 'primary',
          variant: 'solid',
          class: 'bg-[#9B1B3A] text-white hover:bg-[#7d1530] active:bg-[#6b1228] disabled:bg-[#9B1B3A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B1B3A]',
        },
        {
          color: 'primary',
          variant: 'outline',
          class: 'ring ring-inset ring-[#9B1B3A] text-[#9B1B3A] hover:bg-[#9B1B3A]/10 active:bg-[#9B1B3A]/10 disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-[#9B1B3A]',
        },
        {
          color: 'primary',
          variant: 'ghost',
          class: 'text-[#9B1B3A] hover:bg-[#9B1B3A]/10 active:bg-[#9B1B3A]/10 disabled:bg-transparent focus-visible:bg-[#9B1B3A]/10',
        },
        {
          color: 'primary',
          variant: 'soft',
          class: 'text-[#9B1B3A] bg-[#9B1B3A]/10 hover:bg-[#9B1B3A]/15 active:bg-[#9B1B3A]/15 disabled:bg-[#9B1B3A]/10 focus-visible:bg-[#9B1B3A]/15',
        },
        {
          color: 'primary',
          variant: 'link',
          class: 'text-[#9B1B3A] hover:text-[#7d1530] active:text-[#7d1530] disabled:text-[#9B1B3A] focus-visible:ring-2 focus-visible:ring-[#9B1B3A]',
        },

        // ── NEUTRAL ──────────────────────────────────────────────────
        {
          color: 'neutral',
          variant: 'solid',
          class: 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-800 disabled:bg-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900',
        },
        {
          color: 'neutral',
          variant: 'outline',
          class: 'ring ring-inset ring-gray-200 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-50 disabled:bg-white focus-visible:ring-2 focus-visible:ring-gray-900',
        },
        {
          color: 'neutral',
          variant: 'ghost',
          class: 'text-gray-700 hover:bg-gray-100 active:bg-gray-100 disabled:bg-transparent focus-visible:bg-gray-100',
        },

        // ── SQUARE sizes ─────────────────────────────────────────────
        { size: 'xs', square: true, class: 'p-1' },
        { size: 'sm', square: true, class: 'p-1.5' },
        { size: 'md', square: true, class: 'p-1.5' },
        { size: 'lg', square: true, class: 'p-2' },
        { size: 'xl', square: true, class: 'p-2' },

        // ── LOADING spin ─────────────────────────────────────────────
        { loading: true, leading: true, class: { leadingIcon: 'animate-spin' } },
        { loading: true, leading: false, trailing: true, class: { trailingIcon: 'animate-spin' } },
      ],

      defaultVariants: {
        color: 'primary',
        variant: 'solid',
        size: 'md',
      },
    },


    formField: {
      slots: {
        root: 'w-full',
        error: 'text-xs text-red-500 mt-1 pl-1',
        hint: 'text-xs text-gray-400 mt-1',
        label: 'text-sm font-medium text-gray-700 mb-1.5 block',
      },
    },
  },
})
