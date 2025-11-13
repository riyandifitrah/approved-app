@extends('layouts/wrapper')
@push('css')
<link rel="stylesheet" href="{{ asset('css/sb-admin-2.min.css') }}">
<link rel="stylesheet" href="{{ mix('css/app.css') }}">
@endpush
@section('content')
    <body>
        {{-- template for Ract tampil disini --}}
        <div class="" id="root"></div>
        <script src="{{ mix('js/app.js') }}"></script>
    </body>
@endsection
